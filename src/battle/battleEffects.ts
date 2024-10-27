import { createEffect } from "effector";
import {
  getCharacterGuildLevel,
  rollCharacterFleeChance,
} from "../character/models";
import { ICharacterState, TCharacterCombinedState } from "../character/types";
import { RandomBag } from "../common/random";
import { getMapTileByCoordinates } from "../dungeon/model";
import { IMapCoordinates, TDungeonLevelMap } from "../dungeon/types";
import { getMinLevelGuildForSpell } from "../guilds/models";
import {
  applyHurtEffectToMonster,
  udpateEffectTimeout,
} from "../magic/effects/models";
import { IGameEffect } from "../magic/effects/types";
import { createEffectForASpell } from "../magic/models";
import { IGameSpell } from "../magic/types";
import { messageAdded } from "../messages/state";
import { IGameMonster, TMonsterAttack } from "../monsters/model";
import {
  getMonsterSpecialAttack,
  rollAttackCharacterVsMonster,
  rollAttackMonsterVsCharacter,
  rollDamageCharacterVsMonster,
  rollDamageMonsterVsCharacter,
} from "./model";
import { TMonstersHitResult } from "./types";

type TMonsterAttackedParams = {
  monsters: IGameMonster[];
  monsterCursor: number;
  character: TCharacterCombinedState;
};
// calculate results of an character attacking a single monster
export const characterAttacksSingleMonsterFx = createEffect<
  TMonsterAttackedParams,
  TMonstersHitResult,
  TMonstersHitResult
>(
  ({ monsters, monsterCursor, character }) =>
    new Promise((resolve, reject) => {
      // select attacked monster
      const monster = monsters[monsterCursor];
      const attackRoll = rollAttackCharacterVsMonster(character, monster);
      console.log("attackRoll:", attackRoll);
      if (!attackRoll) {
        messageAdded(`You missed ${monster.monster}`);
        const result = monsters.map((_, i) => (i === monsterCursor ? 0 : null));
        reject(result);
        return;
      }
      const damageDone = rollDamageCharacterVsMonster(character, monster);
      console.log("damageDone", damageDone);
      messageAdded(`You hit ${monster.monster} for ${damageDone}`);
      const result = monsters.map((_, i) =>
        i === monsterCursor ? -damageDone : null,
      );
      resolve(result);
    }),
);

// calculate results of an character attacking a single monster with spell
type TMonsterAttackedWithSpellParams = {
  monsters: IGameMonster[];
  monsterCursor: number;
  character: ICharacterState;
  spell: IGameSpell;
};
// the result contains updated monsters (with spell effects) and spell mana cost
type TMonsterAttackedWithSpellResult = {
  manaCost: number;
  monsters: IGameMonster[];
};
export const characterAttacksMonsterWithSpellFx = createEffect<
  TMonsterAttackedWithSpellParams,
  TMonsterAttackedWithSpellResult,
  TMonsterAttackedWithSpellResult
>(
  ({ monsters, monsterCursor, character, spell }) =>
    new Promise((resolve, reject) => {
      // get spell effect and mana cost
      console.log("characterAttacksMonsterWithSpellFx start", spell.name);
      let castingLevel = spell.level;
      // if fixed level from item, then no casting cost should be applied
      let manaCost = 0;
      if (typeof castingLevel === "undefined") {
        const { guild, level, spellCost } = getMinLevelGuildForSpell(
          spell.name,
          character.guilds,
        );
        const currentGuildLevel = getCharacterGuildLevel(guild, character);
        castingLevel = currentGuildLevel - level;
        manaCost = spellCost;
      }
      if (character.mp - manaCost < 0) {
        console.warn("Not enough mana!");
        messageAdded("Not enough mana!");
        reject({ manaCost: 0, monsters });
        return;
      }
      const spellEffect = createEffectForASpell(spell.name, castingLevel);
      if (typeof spellEffect === "undefined") {
        console.warn("Spell does nothing!");
        messageAdded("Spell does nothing!");
        reject({ manaCost: 0, monsters });
        return;
      }
      console.log(`spell ${spell.name} will cost ${manaCost} mana.`);

      // select attacked monster
      const monster = monsters[monsterCursor];
      // TODO: check for monster resistances
      const effects = monster.effects ?? [];
      effects.push(spellEffect);
      monster.effects = effects;
      monsters[monsterCursor] = monster;
      messageAdded(
        `${monster.monster} received effect ${spellEffect.name} with power of ${spellEffect.power}`,
      );
      resolve({ manaCost, monsters });
    }),
);

type TEffectsAppliedToMonstersResult = {
  monsters: IGameMonster[];
  hitResults: TMonstersHitResult;
};
// apply hurting spells effects to monsters and calculate damage done
export const spellEffectsAppliedToMonstersFx = createEffect<
  IGameMonster[] | null,
  TEffectsAppliedToMonstersResult
>(
  (monsters) =>
    new Promise((resolve) => {
      if (!monsters) {
        throw new Error("invalid monsters state");
      }
      const updatedMonsters = [...monsters];
      const hitResults: TMonstersHitResult = [];
      for (const monster of updatedMonsters) {
        const { effects } = monster;
        if (!effects) {
          hitResults.push(null);
          continue;
        }
        let result = 0;
        const updatedEffects: IGameEffect[] = [];
        for (const effect of effects) {
          const damageDone = applyHurtEffectToMonster(effect, monster);
          result += damageDone;
          const updatedEffect = udpateEffectTimeout(effect);
          if (updatedEffect) {
            updatedEffects.push(updatedEffect);
          }
        }
        if (result > 0) {
          hitResults.push(-result);
        } else {
          hitResults.push(null);
        }
        if (updatedEffects.length > 0) {
          monster.effects = updatedEffects;
        }
      }
      resolve({ hitResults, monsters: updatedMonsters });
    }),
);

type TMonsterSpecialRollParams = {
  monster: IGameMonster;
  character: TCharacterCombinedState;
  isDefending: boolean;
};

// detect if monster will do a special attack or not
export const rollMonsterSpecialEffect = createEffect<
  TMonsterSpecialRollParams,
  TMonsterAttack
>(
  ({ character, monster, isDefending }) =>
    new Promise((resolve, reject) => {
      // roll for special attacks of the monster
      const specialAttack = getMonsterSpecialAttack(
        monster,
        character,
        isDefending,
      );
      if (specialAttack === null) {
        reject();
        return;
      }
      resolve(specialAttack);
    }),
);

type TCharacterAttackedParams = {
  monster: IGameMonster;
  character: TCharacterCombinedState;
  isDefending: boolean;
};
export const monsterAttackCharacterFx = createEffect<
  TCharacterAttackedParams,
  number
>(
  (params) =>
    new Promise((resolve, reject) => {
      const { character, monster, isDefending } = params;
      const attackRoll = rollAttackMonsterVsCharacter(
        character,
        monster,
        isDefending,
      );
      console.log("attack roll:", attackRoll);
      if (!attackRoll) {
        reject();
        return;
      }
      // 1. special attack check
      // 2. normal attack check
      const damageDone = rollDamageMonsterVsCharacter(character, monster);
      console.log("damageDone", damageDone);
      resolve(-damageDone);
    }),
);

type TFleeDetectionParams = {
  character: TCharacterCombinedState;
  isFleeing: boolean;
};
export const characterFleeDetectionFx = createEffect<
  TFleeDetectionParams,
  void,
  void
>(
  ({ character, isFleeing }) =>
    new Promise((resolve, reject) => {
      if (!isFleeing) {
        // if not fleeing then just continue as usual
        resolve();
      }
      // check if character managed to flee
      // if succeed we should reject the promise to prevent switching to character round
      const check = rollCharacterFleeChance(character);
      if (check) {
        reject();
        return;
      }
      resolve();
      return;
    }),
);

type TFleeProcessingParams = {
  dungeon: TDungeonLevelMap;
};
export const characterFledFx = createEffect<
  TFleeProcessingParams,
  IMapCoordinates,
  void
>(
  ({ dungeon }) =>
    new Promise((resolve) => {
      // we need to find a tile on the map around the character
      // where s/he can flee - it must be open
      const {
        character: { x, y },
        map,
        height,
        width,
      } = dungeon;
      const possibleCoordinates: IMapCoordinates[] = [];
      if (x > 0) {
        const leftTile = getMapTileByCoordinates({ x: x - 1, y }, map);
        if (leftTile.open) {
          possibleCoordinates.push({ x: x - 1, y });
        }
      }
      if (y > 0) {
        const topTile = getMapTileByCoordinates({ x, y: y - 1 }, map);
        if (topTile.open) {
          possibleCoordinates.push({ x, y: y - 1 });
        }
      }
      if (x < width - 1) {
        const rightTile = getMapTileByCoordinates({ x: x + 1, y }, map);
        if (rightTile.open) {
          possibleCoordinates.push({ x: x + 1, y });
        }
      }
      if (y < height - 1) {
        const bottomTile = getMapTileByCoordinates({ x, y: y + 1 }, map);
        if (bottomTile.open) {
          possibleCoordinates.push({ x, y: y + 1 });
        }
      }
      // choose one of possible coordinates randomly
      const randomBag = new RandomBag(possibleCoordinates);
      const fleeCoordinates = randomBag.getRandomItem();
      resolve(fleeCoordinates);
    }),
);
