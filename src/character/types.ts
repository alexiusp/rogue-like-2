import { EAlignment } from "../common/alignment";
import { TStatsValues } from "../common/stats";
import { IResistance } from "../common/types";
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

// the rest of parameters for the character
export interface ICharacterState {
  // alignment - good/neutral/evil
  alignment: EAlignment;
  // race
  race: ECharacterRace;
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
  ICharacterState & { stats: TStatsValues } & {
    items: TCharacterInventory;
  } & { resistances: IResistance[] };
