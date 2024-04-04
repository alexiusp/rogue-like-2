import { createEffect, createEvent, createStore, sample } from "effector";
import { ICharacterState } from "../../character/models";
import { $character } from "../../character/state";
import { applyEffectToCharacter } from "./models";
import { IGameEffect } from "./types";

export const $characterEffects = createStore<IGameEffect[]>([]);

export const characterReceivedAnEffect = createEvent<IGameEffect>();

$characterEffects.on(characterReceivedAnEffect, (state, effect) => [
  ...state,
  effect,
]);

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
