import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useUnit } from "effector-react";
import { ECharacterRace } from "../character/races";
import { $characterRace, raceChanged } from "../character/state";

export default function RaceInput() {
  const race = useUnit($characterRace);
  return (
    <FormControl fullWidth>
      <InputLabel id="race-label">Choose your race</InputLabel>
      <Select<ECharacterRace>
        labelId="race-label"
        id="race"
        value={race}
        label="Choose your race"
        onChange={(e) => raceChanged(e.target.value as ECharacterRace)}
      >
        <MenuItem value={ECharacterRace.Human}>Human</MenuItem>
        <MenuItem value={ECharacterRace.Elf}>Elf</MenuItem>
      </Select>
    </FormControl>
  );
}
