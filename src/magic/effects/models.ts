import { ICharacterState } from "../../character/types";
import { IGameMonster } from "../../monsters/model";
import GlobalEffectCatalogue from "./GlobalEffectCatalogue";
import { IGameEffect } from "./types";

function applyHealEffectToCharacter(
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

function applyHurtEffectToCharacter(
  effect: IGameEffect,
  character: ICharacterState,
): ICharacterState {
  const { power } = effect;
  const updatedHp = Math.max(0, character.hp - power);
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
      return applyHealEffectToCharacter(effect, character);
    case "hurt":
      return applyHurtEffectToCharacter(effect, character);
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

export function applyHurtEffectToMonster(
  effect: IGameEffect,
  monster: IGameMonster,
): number {
  const baseEffect = GlobalEffectCatalogue[effect.name];
  if (baseEffect.key !== "hurt") {
    return 0;
  }
  const { power } = effect;
  return Math.min(power, monster.hp);
}

export function udpateEffectTimeout(effect: IGameEffect) {
  const updatedEffect: IGameEffect = {
    ...effect,
  };
  if (updatedEffect.timeout) {
    updatedEffect.timeout -= 1;
  }
  if (
    typeof updatedEffect.timeout === "undefined" ||
    updatedEffect.timeout > 0
  ) {
    return updatedEffect;
  }
  return undefined;
}
