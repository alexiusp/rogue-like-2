import { ICharacterState } from "../../character/models";
import { GlobalEffectCatalogue } from "./GlobalEffectCatalogue";
import { IGameEffect } from "./types";

function applyHealEffect(
  effect: IGameEffect,
  character: ICharacterState,
): ICharacterState {
  const { power } = effect;
  const updatedHp = Math.min(character.hpMax, character.hp + power);
  return {
    ...character,
    hp: updatedHp,
  };
}

export function applyEffectToCharacter(
  effect: IGameEffect,
  character: ICharacterState,
): ICharacterState {
  const baseEffect = GlobalEffectCatalogue[effect.name];
  switch (baseEffect.key) {
    case "heal":
      return applyHealEffect(effect, character);
    case "hurt":
      break;
    case "defense":
      break;
    case "protection":
      break;
    case "attack":
      break;
    case "damage":
      break;
  }
  return character;
}
