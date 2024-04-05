import { TGameItem } from "../items/models";

export type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export type THitResult = "hit" | "miss";

export interface IEncounterReward {
  money: number;
  xp: number;
  items: TGameItem[];
}
