import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterAlignment, alignmentChanged } from "../character/state";
import { EAlignment } from "../common/alignment";

export default function AlignmentInput() {
  const alignment = useUnit($characterAlignment);
  return (
    <FormControl fullWidth>
      <InputLabel id="alignment-label">Choose your alignment</InputLabel>
      <Select<EAlignment>
        labelId="alignment-label"
        id="alignment"
        value={alignment}
        label="Choose your alignment"
        onChange={(e) => alignmentChanged(e.target.value as EAlignment)}
      >
        <MenuItem value={EAlignment.Neutral}>Neutral</MenuItem>
        <MenuItem value={EAlignment.Good}>Good</MenuItem>
        <MenuItem value={EAlignment.Evil}>Evil</MenuItem>
      </Select>
    </FormControl>
  );
}
