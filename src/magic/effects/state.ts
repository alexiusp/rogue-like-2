import { createEffect, createEvent, createStore, sample } from "effector";
import { ICharacterState } from "../../character/models";
import {
  $character,
  $characterInventory,
  characterEquippedAnItem,
  characterUnequippedAnItem,
} from "../../character/state";
import GlobalItemsCatalogue from "../../items/GlobalItemsCatalogue";
import { createEffectForASpell } from "../models";
import { applyEffectToCharacter } from "./models";
import { IGameEffect } from "./types";

export const $characterEffects = createStore<IGameEffect[]>([]);

export const characterReceivedAnEffect = createEvent<IGameEffect>();

$characterEffects.on(characterReceivedAnEffect, (state, effect) => [
  ...state,
  effect,
]);

export const characterLostAnEffect = createEvent<IGameEffect>();

$characterEffects.on(characterLostAnEffect, (state, effectToDelete) => {
  const updatedState = [...state];
  const effectIndex = updatedState.findIndex(
    (effect) =>
      effect.name === effectToDelete.name &&
      effect.power === effectToDelete.power &&
      effect.timeout === effectToDelete.timeout,
  );
  if (effectIndex < 0) {
    throw new Error("Effect to remove not found on character!");
  }
  updatedState.splice(effectIndex, 1);
  return updatedState;
});

export const effectsAppliedToCharacter = createEvent<boolean>();
type TEffectToCharacterPayload = {
  character: ICharacterState;
  effects: IGameEffect[];
  onlyLast: boolean;
};
export const effectsAppliedToCharacterFX = createEffect<
  TEffectToCharacterPayload,
  TEffectToCharacterPayload
>(
  ({ character, effects, onlyLast }) =>
    new Promise((resolve) => {
      let updatedCharacter: typeof character = { ...character };
      if (onlyLast && effects.length > 0) {
        const updatedEffects = [...effects];
        const lastEffect = updatedEffects[updatedEffects.length - 1];
        console.log("apply last effect:", lastEffect);
        // reduce timeout for last effect
        const updatedEffect = {
          ...lastEffect,
          timeout: lastEffect.timeout! - 1,
        };
        // if timeout is expired - remove it from the list
        if (updatedEffect.timeout > 0) {
          updatedEffects[updatedEffects.length - 1] = updatedEffect;
        } else {
          updatedEffects.pop();
        }
        resolve({
          character: applyEffectToCharacter(lastEffect, updatedCharacter),
          effects: updatedEffects,
          onlyLast,
        });
      }
      const updatedEffects: IGameEffect[] = [];
      for (const effect of effects) {
        console.log("apply effect:", effect);
        updatedCharacter = applyEffectToCharacter(effect, updatedCharacter);
        if (typeof effect.timeout !== "undefined") {
          // if effect should wear off - reduce its timeout
          const updatedEffect = {
            ...effect,
            timeout: effect.timeout - 1,
          };
          if (updatedEffect.timeout > 0) {
            // add it to effects only if its still active
            updatedEffects.push(updatedEffect);
          }
        } else {
          updatedEffects.push(effect);
        }
      }
      resolve({
        character: updatedCharacter,
        effects: updatedEffects,
        onlyLast,
      });
      return;
    }),
);

sample({
  clock: effectsAppliedToCharacter,
  source: {
    character: $character,
    effects: $characterEffects,
  },
  target: effectsAppliedToCharacterFX,
  fn(src, clk) {
    const { character, effects } = src;
    return { character, effects, onlyLast: clk };
  },
});

// trigger immediate application of effects
// for instant effects
sample({
  clock: characterReceivedAnEffect,
  target: effectsAppliedToCharacter,
  fn() {
    return true;
  },
  filter(effect) {
    return effect.timeout === 1;
  },
});

sample({
  clock: effectsAppliedToCharacterFX.doneData,
  target: $character,
  fn({ character }) {
    return character;
  },
});

sample({
  clock: effectsAppliedToCharacterFX.doneData,
  target: $characterEffects,
  fn({ effects }) {
    return effects;
  },
});

// add an effect when character equips an item with spell
sample({
  clock: characterEquippedAnItem,
  source: $characterInventory,
  target: characterReceivedAnEffect,
  fn(items, itemIndex) {
    const equippedItem = items[itemIndex];
    const baseItem = GlobalItemsCatalogue[equippedItem.item];
    if (!baseItem.spell) {
      throw new Error("Item does not have any spell!");
    }
    const effect = createEffectForASpell(
      baseItem.spell.name,
      baseItem.spell.level ?? 0,
      true,
    );
    if (!effect) {
      throw new Error("Empty effect!");
    }
    console.log("adding effect to character", effect);
    return effect;
  },
  filter(items, itemIndex) {
    const equippedItem = items[itemIndex];
    const baseItem = GlobalItemsCatalogue[equippedItem.item];
    if (!baseItem.spell) {
      return false;
    }
    return true;
  },
});

sample({
  clock: characterUnequippedAnItem,
  source: $characterInventory,
  target: characterLostAnEffect,
  filter(items, itemIndex) {
    const equippedItem = items[itemIndex];
    const baseItem = GlobalItemsCatalogue[equippedItem.item];
    if (!baseItem.spell) {
      return false;
    }
    return true;
  },
  fn(items, itemIndex) {
    const equippedItem = items[itemIndex];
    const baseItem = GlobalItemsCatalogue[equippedItem.item];
    if (!baseItem.spell) {
      throw new Error("Item does not have any spell!");
    }
    const effect = createEffectForASpell(
      baseItem.spell.name,
      baseItem.spell.level ?? 0,
      true,
    );
    if (!effect) {
      throw new Error("Empty effect!");
    }
    console.log("removing effect from character:", effect);
    return effect;
  },
});
