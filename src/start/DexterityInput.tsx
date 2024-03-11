import { Chip, Slider, Stack } from "@mui/material";
import { useUnit } from "effector-react";
import { RaceStatsMap } from "../character/races";
import {
  $characterDexterity,
  $characterRace,
  $freePoints,
  dexterityChanged,
  freePointsChanged,
} from "../character/state";
import { TStatNames } from "../common/stats";
import { capitalize } from "../common/strings";

export default function DexterityInput() {
  const race = useUnit($characterRace);
  const freePoints = useUnit($freePoints);
  const value = useUnit($characterDexterity);
  const updateValue = (newValue: number) => {
    const delta = newValue - value;
    if (freePoints - delta < 0) {
      return;
    }
    freePointsChanged(delta);
    dexterityChanged(newValue);
  };
  const updateValueHandler = (_event: Event, value: number | number[]) => {
    const newValue = Number(value);
    if (isNaN(newValue)) {
      return;
    }
    updateValue(newValue);
  };
  const stat: TStatNames = "dexterity";
  return (
    <>
      <label id="value-input-label">{capitalize(stat)}</label>
      <Stack direction="row" spacing={1}>
        <Chip
          label={RaceStatsMap[stat][race][0]}
          onClick={() => updateValue(RaceStatsMap[stat][race][0])}
        />
        <Slider
          aria-labelledby="value-input-label"
          valueLabelDisplay="auto"
          marks={true}
          min={RaceStatsMap[stat][race][0]}
          max={RaceStatsMap[stat][race][1]}
          value={value}
          onChange={updateValueHandler}
        />
        <Chip
          label={RaceStatsMap[stat][race][1]}
          onClick={() => updateValue(RaceStatsMap[stat][race][1])}
        />
      </Stack>
    </>
  );
}
