import { TGameItem } from "../items/models";

export type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export type TCharacterHitResult = number | null;
export type TMonstersHitResult = Array<number | null>;

export interface IEncounterReward {
  money: number;
  xp: number;
  items: TGameItem[];
}
