import { combine } from "effector";
import { IResistance } from "../common/types";
import { filterEffectsByKey, getEffectNature } from "../magic/effects/models";
import { $characterEffects } from "../magic/effects/state";
import { getRaceResistances } from "./races";
import { $characterRace } from "./state";

// TODO: character resistances - they must be calculated from race
// and currently equipped items and spell effects
export const $characterResistances = combine(
  $characterRace,
  $characterEffects,
  (race, effects) => {
    const resistances: IResistance[] = getRaceResistances(race);
    // TODO: add resistances from items
    const resistanceEffects = filterEffectsByKey(effects, "resistance");
    for (const effect of resistanceEffects) {
      const resistance: IResistance = {
        element: getEffectNature(effect),
        ratio: effect.power,
      };
      resistances.push(resistance);
    }
    return resistances;
  },
);
