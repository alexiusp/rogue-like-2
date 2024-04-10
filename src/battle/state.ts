import { createEffect, createEvent, createStore, sample } from "effector";
import {
  ICharacterState,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterGuildLevel,
  getCharacterProtection,
  rollCharacterFleeChance,
} from "../character/models";
import {
  $character,
  $characterIsDead,
  characterResurrected,
} from "../character/state";
import { createDelayEffect } from "../common/delay";
import { RandomBag } from "../common/random";
import {
  getMapTileByCoordinates,
  getTileIndexByCoordinates,
} from "../dungeon/model";
import {
  $currentLevel,
  $currentMapTile,
  $dungeonLevelMap,
  $dungeonState,
  $encounter,
  moveCharacter,
  startMonsterBattle,
} from "../dungeon/state";
import {
  EEncounterType,
  IMapCoordinates,
  IMonsterEncounter,
  IMonsterMapTile,
  TDungeonLevelMap,
} from "../dungeon/types";
import { getMinLevelGuildForSpell } from "../guilds/models";
import { TGameItem, itemsAreSame } from "../items/models";
import { applyEffectToMonster } from "../magic/effects/models";
import {
  createEffectForASpell,
  isSpellCombat,
  isTargetedOnSelfSpell,
  isTargetedSpell,
} from "../magic/models";
import { characterCastsASpell } from "../magic/state";
import { IGameSpell } from "../magic/types";
import { messageAdded } from "../messages/state";
import {
  EAggroMode,
  IGameMonster,
  areAllMonstersDead,
  generateMonstersItemsReward,
  generateMonstersMoneyReward,
  generateMonstersXpReward,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import { forward } from "../navigation";
import { rollAttack, rollDamage } from "./model";
import { IEncounterReward, TBattleRound, THitResult } from "./types";

const startCharacterRound = createEvent();
startCharacterRound.watch(() => console.info("startCharacterRound"));
sample({
  clock: startMonsterBattle,
  target: startCharacterRound,
});

export const $battleRound = createStore<TBattleRound>("character");
$battleRound.reset(startCharacterRound);
//$battleRound.on(startCharacterRound, () => 'character');
$battleRound.watch((s) => console.info("battle round:", s));

export const $hitResult = createStore<THitResult | null>(null);
$hitResult.reset(startMonsterBattle);
$hitResult.reset(startCharacterRound);
$hitResult.watch((hitResult) => console.info("hitResult:", hitResult));

type TMonsterAttackedParams = {
  mapTile: IMonsterMapTile;
  monsterCursor: number;
  character: ICharacterState;
};
// calculate results of an character attacking a single monster
export const characterAttacksMonsterFx = createEffect<
  TMonsterAttackedParams,
  Array<IGameMonster>,
  Array<IGameMonster>
>(
  ({ mapTile, monsterCursor, character }) =>
    new Promise((resolve, reject) => {
      // all monsters must aggro
      const monsters = mapTile.encounter.monsters.map((m) => ({
        ...m,
        aggro: EAggroMode.Angry,
      }));
      // select attacked monster
      const monster = monsters[monsterCursor];
      const attack = getCharacterAttack(character);
      const defense = getMonsterDV(monster);
      const attackRoll = rollAttack(attack, defense);
      console.log("attackRoll:", attackRoll);
      if (!attackRoll) {
        messageAdded(`You missed ${monster.monster}`);
        reject(monsters);
        return;
      }
      const damage = getCharacterDamage(character);
      const protection = getMonsterPV(monster);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      monster.hp = Math.max(monster.hp - damageDone, 0);
      monsters[monsterCursor] = monster;
      messageAdded(`You hit ${monster.monster} for ${damageDone}`);
      resolve(monsters);
    }),
);

// event to fire from UI
export const monsterAttacked = createEvent<number>();
// collect data from stores to calculate an attack
sample({
  clock: monsterAttacked,
  source: { tile: $currentMapTile, character: $character },
  target: characterAttacksMonsterFx,
  fn: ({ tile, character }, index) => {
    const mapTile = tile as IMonsterMapTile;
    const params: TMonsterAttackedParams = {
      mapTile,
      character,
      monsterCursor: index,
    };
    return params;
  },
});

const characterToMonsterTransition = createEvent();
characterToMonsterTransition.watch(() =>
  console.info("characterToMonsterTransition"),
);
// stop rounds rotation when all monsters are dead
sample({
  clock: characterAttacksMonsterFx.finally,
  filter: (clock) => {
    const result = clock.status === "done" ? clock.result : clock.error;
    return !areAllMonstersDead(result);
  },
  target: characterToMonsterTransition,
});
// switch round stage after attack is done
$battleRound.on(characterToMonsterTransition, () => "character-to-monster");
// set animation state to result of an attack
$hitResult.on(characterAttacksMonsterFx.done, () => "hit");
$hitResult.on(characterAttacksMonsterFx.fail, () => "miss");

// update dungeon state with results of an attack
sample({
  clock: characterAttacksMonsterFx.finally,
  source: { state: $dungeonState, level: $currentLevel },
  target: $dungeonState,
  fn: (source, clock) => {
    const params = clock.params;
    const result = clock.status === "done" ? clock.result : clock.error;
    const { state, level } = source;
    const updatedMonsters = [...result];
    const levelMap = [...state[level]];
    const updatedMapTile = { ...params.mapTile };
    const tileIndex = getTileIndexByCoordinates(
      { x: updatedMapTile.x, y: updatedMapTile.y },
      levelMap,
    );
    updatedMapTile.encounter = {
      ...updatedMapTile.encounter,
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = updatedMapTile;
    const updatedState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});

const BATTLE_ROUND_DELAY_MS = 1000;
const delay = createDelayEffect(BATTLE_ROUND_DELAY_MS);

const characterToMonsterTransitionFx = createEffect(delay);
// reset hit result when transition done
$hitResult.reset(characterToMonsterTransitionFx.done);

// trigger character to monster transition effect when round triggered
sample({
  clock: characterToMonsterTransition,
  target: characterToMonsterTransitionFx,
});

const startMonstersRound = createEvent();
// trigger monsters round when transition done
sample({
  clock: characterToMonsterTransitionFx.done,
  target: startMonstersRound,
});
// switch to battle round when transition done
$battleRound.on(startMonstersRound, () => "monster");

// length of monsters array of current encounter
const $monstersLength = createStore<number>(0);
$monstersLength.watch((length) => console.info("$monstersLength:", length));
export const $monstersCursor = createStore<number | null>(null);
$monstersCursor.watch((cursor) => console.info("$monstersCursor:", cursor));
$monstersCursor.reset(startCharacterRound);

// defend mode - increase (double) defense for the next round
// in future we can consider to keep defense boost for several rounds
// to make it more useful for current single-character mode
export const characterDefends = createEvent();
const $isDefending = createStore(false);
$isDefending.on(characterDefends, () => true);
$isDefending.reset(startCharacterRound);

// flee mode - monsters are making a round
// and at end we roll if character can exit the battle
export const characterTriesToFlee = createEvent();
const $isFleeing = createStore(false);
$isFleeing.on(characterTriesToFlee, () => true);
$isFleeing.reset(startCharacterRound);

// start monsters round right after defend mode is set
sample({
  clock: characterDefends,
  target: startMonstersRound,
});

// start monsters round right after flee mode is set
sample({
  clock: characterTriesToFlee,
  target: startMonstersRound,
});

// calculate monsters length
sample({
  clock: startMonsterBattle,
  source: $encounter,
  target: $monstersLength,
  filter: (encounter) => encounter?.type === EEncounterType.Monster,
  fn: (encounter) => {
    return (encounter as IMonsterEncounter).monsters.length;
  },
});

// set cursor to the first alive monster when round starts
sample({
  clock: startMonstersRound,
  source: $encounter,
  target: $monstersCursor,
  fn: (encounter) => {
    if (!encounter || encounter.type !== EEncounterType.Monster) {
      throw Error("Wrong encounter");
    }
    let cursor = 0;
    while (encounter.monsters[cursor].hp === 0) {
      cursor += 1;
    }
    return cursor;
  },
});

// event to fire when monster attacks character
// parameter - monster index in the monsters list of an encounter
const characterAttackedByMonster = createEvent<number | null>();
characterAttackedByMonster.watch((cursor) =>
  console.info("characterAttackedByMonster:", cursor),
);

sample({
  clock: $monstersCursor,
  source: $monstersCursor,
  filter(src) {
    return src !== null;
  },
  target: characterAttackedByMonster,
});

type TCharacterAttackedParams = {
  monster: IGameMonster;
  character: ICharacterState;
  isDefending: boolean;
};
export const monsterAttackCharacterFx = createEffect<
  TCharacterAttackedParams,
  ICharacterState
>(
  (params) =>
    new Promise((resolve, reject) => {
      const { character, monster, isDefending } = params;
      const attack = getMonsterAttack(monster);
      const defense = getCharacterDefense(character, isDefending);
      const attackRoll = rollAttack(attack, defense);
      console.log("attack roll:", attackRoll);
      if (!attackRoll) {
        reject();
        return;
      }
      const damage = getMonsterDamage(monster);
      const protection = getCharacterProtection(character);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      const hp = Math.max(character.hp - damageDone, 0);
      character.hp = hp;
      resolve(character);
    }),
);

// trigger monster attack calculation
sample({
  clock: characterAttackedByMonster,
  source: {
    character: $character,
    encounter: $encounter,
    isDefending: $isDefending,
  },
  target: monsterAttackCharacterFx,
  filter: (src, clock) => {
    console.log("characterAttackedByMonster monster attack start check", clock);
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skip monsters not angry or dead
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      console.log(
        "characterAttackedByMonster dead or not angry - skip",
        EAggroMode[monster.aggro],
        monster.hp,
      );
      return false;
    }
    console.log("characterAttackedByMonster monster attack start check", true);
    return true;
  },
  fn(src, clock) {
    const monster = (src.encounter as IMonsterEncounter).monsters[clock!];
    const character = src.character;
    const isDefending = src.isDefending;
    return {
      character,
      monster,
      isDefending,
    };
  },
});

// pause between different monster attacks
export const monsterAttackTransitionFx = createEffect(delay);

// trigger delay transition when monster was skipped
sample({
  clock: characterAttackedByMonster,
  source: { character: $character, encounter: $encounter },
  target: monsterAttackTransitionFx,
  filter: (src, clock) => {
    console.log("characterAttackedByMonster monster skip check", clock);
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skipped monsters not angry or dead should trigger immediate transition
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      console.log(
        "characterAttackedByMonster monster dead or not angry - trigger transition to next",
        monster,
        clock,
      );
      return true;
    }
    console.log("characterAttackedByMonster monster skip check", false);
    return false;
  },
});

// set animation state to result of an attack
$hitResult.on(monsterAttackCharacterFx.done, () => "hit");
$hitResult.on(monsterAttackCharacterFx.fail, () => "miss");

// update character state after successfull attack
$character.on(monsterAttackCharacterFx.done, (_, params) => {
  return {
    ..._,
    ...params.result,
  };
});

// monster attack completed - start transition to next monster
sample({
  clock: monsterAttackCharacterFx.finally,
  target: monsterAttackTransitionFx,
});

// switch to next monster if any
sample({
  clock: monsterAttackTransitionFx.done,
  target: $monstersCursor,
  source: {
    index: $monstersCursor,
    length: $monstersLength,
    characterIsDead: $characterIsDead,
    encounter: $encounter,
  },
  fn: (src) => {
    const { index, length, characterIsDead, encounter } = src;
    // check if round ended
    const check = index !== null && index < length - 1 && !characterIsDead;
    if (!check) {
      console.log("round ended");
      // set cursor to null if last alive monster
      return null;
    }
    const monsters = (encounter as IMonsterEncounter).monsters;
    let cursor = null;
    // find next alive and angry monster
    for (let i = index + 1; i < monsters.length; i++) {
      const monster = monsters[i];
      if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
        continue;
      }
      cursor = i;
      break;
    }
    // if no alive monsters left set cursor to null
    return cursor;
  },
});

// reset hit result animation
$hitResult.reset(monsterAttackTransitionFx.done);

// trigger transition to character when all monsters attacked
const monsterToCharacterTransition = createEvent();
monsterToCharacterTransition.watch(() =>
  console.info("monsterToCharacterTransition"),
);

sample({
  clock: monsterAttackTransitionFx.finally,
  target: monsterToCharacterTransition,
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index } = src;
    // if cursor is reset to null - monster phase is finished
    const monstersAttackFinished = index === null;
    console.log("monstersAttackFinished", monstersAttackFinished);
    return monstersAttackFinished;
  },
});
// switch round stage after attack is done
$battleRound.on(monsterToCharacterTransition, () => "monster-to-character");

type TFleeDetectionParams = {
  character: ICharacterState;
  isFleeing: boolean;
};
const monsterToCharacterTransitionFx = createEffect<
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

// trigger monster to character transition effect when round triggered
sample({
  clock: monsterToCharacterTransition,
  source: { character: $character, isFleeing: $isFleeing },
  target: monsterToCharacterTransitionFx,
});

// start new character round when transition successfull
sample({
  clock: monsterToCharacterTransitionFx.done,
  target: startCharacterRound,
});

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

// find appropriate cell and redirect to dungeon when transition failed
sample({
  clock: monsterToCharacterTransitionFx.fail,
  source: { dungeon: $dungeonLevelMap },
  target: characterFledFx,
});

sample({
  clock: characterFledFx.doneData,
  target: moveCharacter,
});

sample({
  clock: characterFledFx.finally,
  target: forward,
  fn: () => "dungeon",
});

export const battleEnded = createEvent<IGameMonster[]>();

// detect end of the battle after character round
sample({
  clock: characterAttacksMonsterFx.finally,
  filter: (clock) => {
    const result = clock.status === "done" ? clock.result : clock.error;
    return areAllMonstersDead(result);
  },
  fn(clock) {
    const result = clock.status === "done" ? clock.result : clock.error;
    return result;
  },
  target: battleEnded,
});
sample({ clock: battleEnded, target: forward, fn: () => "reward" });

export const $encounterMoneyReward = createStore(0);
export const $encounterItemsReward = createStore<TGameItem[]>([]);
export const $encounterXpReward = createStore(0);

//const encounterEndedWithReward = createEvent<IEncounterReward>();
const rewardCalculationFx = createEffect<
  { character: ICharacterState; monsters: IGameMonster[] },
  IEncounterReward
>(({ character, monsters }) => {
  const money = generateMonstersMoneyReward(monsters);
  const xp = generateMonstersXpReward(monsters);
  const items = generateMonstersItemsReward(monsters, character);
  const pluralSuffix = items.length > 1 ? "s" : "";
  messageAdded(
    `You've got ${money} gold, ${xp} experience and ${items.length} item${pluralSuffix} as a reward for this victory!`,
  );
  const reward: IEncounterReward = {
    money,
    xp,
    items,
  };
  return reward;
});

sample({
  clock: battleEnded,
  source: $character,
  target: rewardCalculationFx,
  fn: (character, monsters) => ({ character, monsters }),
});

$encounterMoneyReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.money,
);
$encounterItemsReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.items,
);
$encounterXpReward.on(rewardCalculationFx.doneData, (_, reward) => reward.xp);

export const itemDropped = createEvent<TGameItem>();
$encounterItemsReward.on(itemDropped, (items, item) => {
  const index = items.findIndex(itemsAreSame(item));
  if (index < 0) {
    throw new Error("Item to drop not found in the loot!");
  }
  const udpatedItems = [...items];
  udpatedItems.splice(index, 1);
  return udpatedItems;
});

export const waitForRescueTeam = createEvent();
sample({
  clock: waitForRescueTeam,
  source: $currentLevel,
  target: characterResurrected,
});

export const $spellSelected = createStore<IGameSpell | null>(null);

// save combat spell to store when cast
// to wait for target selection
sample({
  clock: characterCastsASpell,
  target: $spellSelected,
  filter(spell) {
    // filter only combat spells
    if (!isSpellCombat(spell.name)) {
      return false;
    }
    // and not target=all or self - they will trigger immediately
    if (!isTargetedSpell(spell.name)) {
      return false;
    }
    return true;
  },
});

// switch to monsters turn when cast spell on self
sample({
  clock: characterCastsASpell,
  source: $encounter,
  target: startMonstersRound,
  filter(encounter, spell) {
    // ignore if not in an encounter
    if (encounter === null) {
      return false;
    }
    // filter only combat spells
    if (!isSpellCombat(spell.name)) {
      return false;
    }
    // and target = self
    return isTargetedOnSelfSpell(spell.name);
  },
});

// TODO: target=all handling

// TODO: targeted spell handling - create a separate event and fire it from UI
// need to create a spell for testing first
export const monsterAttackedBySpell = createEvent<number>();

// calculate results of an character attacking a single monster with spell
type TMonsterAttackedWithSpellParams = {
  mapTile: IMonsterMapTile;
  monsterCursor: number;
  character: ICharacterState;
  spell: IGameSpell;
};
type TMonsterAttackedWithSpellResult = {
  character: ICharacterState;
  monsters: Array<IGameMonster>;
};
export const characterAttacksMonsterWithSpellFx = createEffect<
  TMonsterAttackedWithSpellParams,
  TMonsterAttackedWithSpellResult,
  TMonsterAttackedWithSpellResult
>(
  ({ mapTile, monsterCursor, character, spell }) =>
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
        reject({ character, monsters: mapTile.encounter.monsters });
        return;
      }
      const spellEffect = createEffectForASpell(spell.name, castingLevel);
      if (typeof spellEffect === "undefined") {
        console.warn("Spell does nothing!");
        messageAdded("Spell does nothing!");
        reject({ character, monsters: mapTile.encounter.monsters });
        return;
      }
      // update characters mana
      const updatedCharacter: typeof character = {
        ...character,
        mp: character.mp - manaCost,
      };

      // all monsters must aggro
      const monsters = mapTile.encounter.monsters.map((m) => ({
        ...m,
        aggro: EAggroMode.Angry,
      }));
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
      resolve({ character: updatedCharacter, monsters });
    }),
);

// set animation state to result of an attack
$hitResult.on(characterAttacksMonsterWithSpellFx.done, () => "hit");

// trigger effect when event is dispatched
sample({
  clock: monsterAttackedBySpell,
  source: {
    tile: $currentMapTile,
    character: $character,
    spell: $spellSelected,
  },
  target: characterAttacksMonsterWithSpellFx,
  fn: ({ tile, character, spell }, index) => {
    if (!spell) {
      // this error should never happen actually
      throw new Error("Invalid spell!");
    }
    const mapTile = tile as IMonsterMapTile;
    const params: TMonsterAttackedWithSpellParams = {
      mapTile,
      character,
      monsterCursor: index,
      spell,
    };
    return params;
  },
  filter({ spell }) {
    if (spell === null) {
      return false;
    }
    // TODO: implement other checks? what shold they be?
    return true;
  },
});

// apply effects to monsters before switching to the monsters turn
const spellEffectsAppliedToMonstersFx = createEffect<
  IGameMonster[],
  IGameMonster[],
  IGameMonster[]
>(
  (monsters) =>
    new Promise((res) => {
      const updatedMonsters: IGameMonster[] = monsters.map((monster) => {
        const effects = monster.effects;
        if (!effects || !effects.length) {
          return monster;
        }
        let updatedMonster = monster;
        for (const effect of effects) {
          updatedMonster = applyEffectToMonster(effect, monster);
        }
        return updatedMonster;
      });
      res(updatedMonsters);
      return;
    }),
);

// redirect monsters data from effects generation to application
sample({
  clock: characterAttacksMonsterWithSpellFx.doneData,
  target: spellEffectsAppliedToMonstersFx,
  fn({ monsters }) {
    return [...monsters];
  },
});

// apply mana reduction to the character
sample({
  clock: characterAttacksMonsterWithSpellFx.doneData,
  target: $character,
  fn({ character }) {
    return { ...character };
  },
});

// stop rounds rotation when all monsters are dead
sample({
  clock: spellEffectsAppliedToMonstersFx.doneData,
  filter: (monsters) => {
    return !areAllMonstersDead(monsters);
  },
  target: characterToMonsterTransition,
});

// update dungeon state with results of an attack
sample({
  clock: spellEffectsAppliedToMonstersFx.doneData,
  source: {
    state: $dungeonState,
    level: $currentLevel,
    mapTile: $currentMapTile,
  },
  target: $dungeonState,
  fn: (source, monsters) => {
    const { state, level, mapTile } = source;
    const updatedMonsters = [...monsters];
    const levelMap = [...state[level]];
    const updatedMapTile = { ...mapTile } as IMonsterMapTile;
    const tileIndex = getTileIndexByCoordinates(
      { x: updatedMapTile.x, y: updatedMapTile.y },
      levelMap,
    );
    updatedMapTile.encounter = {
      ...updatedMapTile.encounter,
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = updatedMapTile;
    const updatedState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});
