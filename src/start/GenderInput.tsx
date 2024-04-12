import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterBaseInfo, genderChanged } from "../character/state";
import { EGender } from "../character/types";

export default function GenderInput() {
  const baseInfo = useUnit($characterBaseInfo);
  return (
    <FormControl fullWidth>
      <InputLabel id="gender-label">Choose your gender</InputLabel>
      <Select<EGender>
        labelId="gender-label"
        id="gender"
        value={baseInfo.gender}
        label="Choose your gender"
        onChange={(e) => genderChanged(e.target.value as EGender)}
      >
        <MenuItem value={EGender.Female}>Female</MenuItem>
        <MenuItem value={EGender.Male}>Male</MenuItem>
        <MenuItem value={EGender.Other}>Other</MenuItem>
      </Select>
    </FormControl>
  );
}
