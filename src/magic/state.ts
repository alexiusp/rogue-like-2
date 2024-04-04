import { createEffect, createEvent, sample } from "effector";
import { ICharacterState, getCharacterGuildLevel } from "../character/models";
import { $character, $characterGuilds } from "../character/state";
import {
  getAllSpellsFromGuilds,
  getMinLevelGuildForSpell,
} from "../guilds/models";
import { characterReceivedAnEffect } from "./effects/state";
import { IGameEffect } from "./effects/types";
import { createEffectForASpell } from "./models";
import { IGameSpell } from "./types";

export const $characterSpells = $characterGuilds.map((guilds) =>
  getAllSpellsFromGuilds(guilds),
);

export const characterCastsASpell = createEvent<IGameSpell>();
characterCastsASpell.watch(() => console.log("characterCastsASpell"));

type TSpellCastPayload = { character: ICharacterState; spell: IGameSpell };
type TSpellCastResult = { character: ICharacterState; effect: IGameEffect };
const characterCastsASpellFx = createEffect<
  TSpellCastPayload,
  TSpellCastResult,
  string
>(
  ({ character, spell }) =>
    new Promise((resolve, reject) => {
      console.log("characterCastsASpellFx start", spell.name);
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
        reject("Not enough mana!");
        return;
      }
      const spellEffect = createEffectForASpell(spell.name, castingLevel);
      if (typeof spellEffect === "undefined") {
        console.warn("Spell does nothing!");
        reject("Spell does nothing!");
        return;
      }
      const updatedCharacter: typeof character = {
        ...character,
        mp: character.mp - manaCost,
      };
      resolve({ character: updatedCharacter, effect: spellEffect });
    }),
);

// trigger effect when character casts a spell
sample({
  clock: characterCastsASpell,
  source: $character,
  target: characterCastsASpellFx,
  fn(src, clk) {
    return { character: src, spell: clk };
  },
  // TODO: add filter to check for posible limitations - mana cost etc.
});

// update character with results of the spell - reduce mana if applicable
$character.on(characterCastsASpellFx.doneData, (_, { character }) => character);

// add effect to character effects
sample({
  clock: characterCastsASpellFx.doneData,
  target: characterReceivedAnEffect,
  fn(clk) {
    return clk.effect;
  },
});
