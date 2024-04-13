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

function applyHurtEffectToMonster(
  effect: IGameEffect,
  monster: IGameMonster,
): IGameMonster {
  const { power } = effect;
  const updatedHp = Math.max(0, monster.hp - power);
  return {
    ...monster,
    hp: updatedHp,
  };
}

function applyHealEffectToMonster(
  effect: IGameEffect,
  monster: IGameMonster,
): IGameMonster {
  const { power } = effect;
  const updatedHp = Math.min(monster.hpMax, monster.hp + power);
  return {
    ...monster,
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

export function applyEffectToMonster(
  effect: IGameEffect,
  monster: IGameMonster,
): IGameMonster {
  const baseEffect = GlobalEffectCatalogue[effect.name];
  switch (baseEffect.key) {
    case "heal":
      return applyHealEffectToMonster(effect, monster);
    case "hurt":
      return applyHurtEffectToMonster(effect, monster);
    case "defense":
      break;
    case "protection":
      break;
    case "attack":
      break;
    case "damage":
      break;
  }
  return monster;
}

export function applyEffectsToMonster(monster: IGameMonster): IGameMonster {
  const { effects } = monster;
  if (!effects) {
    // nothing to apply
    return monster;
  }
  let updatedMonster: IGameMonster = {
    ...monster,
  };
  const updatedEffects: IGameEffect[] = [];
  for (const effect of effects) {
    updatedMonster = applyEffectToMonster(effect, updatedMonster);
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
      updatedEffects.push(updatedEffect);
    }
  }
  if (updatedEffects.length > 0) {
    updatedMonster.effects = updatedEffects;
  }
  return updatedMonster;
}
