import { Chip, Slider, Stack } from "@mui/material";
import { useUnit } from "effector-react";
import { RaceStatsMap } from "../character/races";
import {
  $characterRace,
  $characterStrength,
  $freePoints,
  freePointsChanged,
  strengthChanged,
} from "../character/state";

export default function StrengthInput() {
  const race = useUnit($characterRace);
  const freePoints = useUnit($freePoints);
  const strength = useUnit($characterStrength);
  const updateStrength = (newValue: number) => {
    const delta = newValue - strength;
    if (freePoints - delta < 0) {
      return;
    }
    freePointsChanged(delta);
    strengthChanged(newValue);
  };
  const updateStrengthHandler = (_event: Event, value: number | number[]) => {
    const newValue = Number(value);
    if (isNaN(newValue)) {
      return;
    }
    updateStrength(newValue);
  };
  return (
    <>
      <label id="strength-label">Strength</label>
      <Stack direction="row" spacing={1}>
        <Chip
          label={RaceStatsMap.strength[race][0]}
          onClick={() => updateStrength(RaceStatsMap.strength[race][0])}
        />
        <Slider
          aria-labelledby="strength-label"
          valueLabelDisplay="auto"
          marks={true}
          min={RaceStatsMap.strength[race][0]}
          max={RaceStatsMap.strength[race][1]}
          value={strength}
          onChange={updateStrengthHandler}
        />
        <Chip
          label={RaceStatsMap.strength[race][1]}
          onClick={() => updateStrength(RaceStatsMap.strength[race][1])}
        />
      </Stack>
    </>
  );
}
