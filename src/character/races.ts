import { TStatNames } from "../common/stats";

export enum ECharacterRace {
  Human,
  Elf,
}

export const RaceMap = {
  human: ECharacterRace.Human,
  elf: ECharacterRace.Elf,
};

// limitations to stats for given race
type TRaceStatsMap = {
  [name in TStatNames]: {
    [race in ECharacterRace]: [number, number];
  };
};
// minimum and maximum stats for races when new character is generated
// during game stat can not be more than 5 above the maximum
export const RaceStatsMap: TRaceStatsMap = {
  strength: {
    [ECharacterRace.Human]: [4, 17],
    [ECharacterRace.Elf]: [3, 15],
  },
  intelligence: {
    [ECharacterRace.Human]: [4, 18],
    [ECharacterRace.Elf]: [7, 20],
  },
  wisdom: {
    [ECharacterRace.Human]: [4, 18],
    [ECharacterRace.Elf]: [7, 20],
  },
  endurance: {
    [ECharacterRace.Human]: [6, 17],
    [ECharacterRace.Elf]: [3, 16],
  },
  charisma: {
    [ECharacterRace.Human]: [5, 18],
    [ECharacterRace.Elf]: [3, 18],
  },
  dexterity: {
    [ECharacterRace.Human]: [6, 18],
    [ECharacterRace.Elf]: [3, 18],
  },
};

export const RaceAgeMap: {
  [race in ECharacterRace]: [number, number];
} = {
  [ECharacterRace.Human]: [18, 80],
  [ECharacterRace.Elf]: [100, 900],
};

export function getRaceHealthModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    default:
      // default bonus for human-like races is 0
      modifier = 0;
  }
  return modifier;
}

export function getRaceManaModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    case ECharacterRace.Elf:
      modifier = 1.8;
      break;
    default:
      // default bonus for non-magical affine races is 1
      modifier = 1;
  }
  return modifier;
}

export function getRaceAttackModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    // elvish folk has slightly better chance of hitting
    case ECharacterRace.Elf:
      modifier = 1.05;
      break;
    default:
      // default value for human-like races is 1
      modifier = 1;
  }
  return modifier;
}

export function getRaceDamageModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    default:
      // default value for human-like races is 1
      modifier = 1;
  }
  return modifier;
}

export function getRaceDefenseModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    default:
      // default value for human-like races is 1
      modifier = 1;
  }
  return modifier;
}

export function getRaceProtectionModifier(race: ECharacterRace) {
  let modifier: number;
  switch (race) {
    case ECharacterRace.Elf:
      modifier = 0.95;
      break;
    default:
      // default value for human-like races is 1
      modifier = 1;
  }
  return modifier;
}
