export type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export type THitResult = "hit" | "miss";

export type TBattleMode = "defend" | "fight" | "flee" | "items" | "spells";
