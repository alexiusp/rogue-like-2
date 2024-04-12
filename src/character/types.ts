import { EAlignment } from "../common/alignment";
import { TStatsValues } from "../common/stats";
import { EGuild, IGuildMembership } from "../guilds/types";
import { TGameItem } from "../items/models";
import { ECharacterRace } from "./races";

export enum EGender {
  Male,
  Female,
  Other,
}

// first screen of character creation
export interface IBaseCharacterInfo {
  name: string;
  picture: string;
  gender: EGender;
}

// second screen of character creation
export interface ICharacter {
  alignment: EAlignment;
  race: ECharacterRace;
  stats: TStatsValues;
}

// the rest of parameters for the character
export interface ICharacterState extends ICharacter {
  // characters age
  age: number;
  // hit points - character health
  hp: number;
  hpMax: number;
  // mana points - amount of magic powers
  mp: number;
  mpMax: number;
  // guild memebership info
  guilds: Array<IGuildMembership>;
  // currently selected guild
  guild: EGuild;
  // money
  money: number;
}

export type TCharacterInventory = Array<TGameItem>;

export type TCharacterCombinedState = IBaseCharacterInfo &
  ICharacterState & {
    items: TCharacterInventory;
  };
