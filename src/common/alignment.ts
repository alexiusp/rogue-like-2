import { getRandomInt } from "./random";

export enum EAlignment {
  Good,
  Neutral,
  Evil,
}

export type TAlignShort = "G" | "N" | "E";
export const AlignmentStrings: {
  [alignment: number]: [short: TAlignShort, long: string];
} = {
  [EAlignment.Good]: ["G", "Good"],
  [EAlignment.Neutral]: ["N", "Neutral"],
  [EAlignment.Evil]: ["E", "Evil"],
};

export function getAlignmentShort(alignment?: EAlignment): TAlignShort | "U" {
  return typeof alignment !== "undefined"
    ? AlignmentStrings[alignment][0]
    : "U";
}

export function getAlignmentLong(alignment?: EAlignment): string {
  return typeof alignment !== "undefined"
    ? AlignmentStrings[alignment][1]
    : "Unknown";
}

export function generateRandomAlignment() {
  return getRandomInt(EAlignment.Evil) as EAlignment;
}
