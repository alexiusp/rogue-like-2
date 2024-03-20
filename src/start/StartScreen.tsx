import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { EGender } from "../character/models";
import { ECharacterRace } from "../character/races";
import {
  $character,
  alignmentChanged,
  genderChanged,
  nameChanged,
  raceChanged,
} from "../character/state";
import { EAlignment } from "../common/alignment";
import Screen from "../layout/Screen";
import { navigate } from "../navigation";

export default function StartScreen() {
  const character = useUnit($character);
  const submitHandler = () => {
    navigate("generate");
  };
  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          Start new game
        </Typography>
      }
      sx={{
        height: "100vh",
        justifyContent: "center",
        mb: 0,
        mt: 0,
        my: 0,
      }}
    >
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="gender-label">Choose your gender</InputLabel>
          <Select<EGender>
            labelId="gender-label"
            id="gender"
            value={character.gender}
            label="Choose your gender"
            onChange={(e) => genderChanged(e.target.value as EGender)}
          >
            <MenuItem value={EGender.Female}>Female</MenuItem>
            <MenuItem value={EGender.Male}>Male</MenuItem>
            <MenuItem value={EGender.Other}>Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="race-label">Choose your race</InputLabel>
          <Select<ECharacterRace>
            labelId="race-label"
            id="race"
            value={character.race}
            label="Choose your race"
            onChange={(e) => raceChanged(e.target.value as ECharacterRace)}
          >
            <MenuItem value={ECharacterRace.Human}>Human</MenuItem>
            <MenuItem value={ECharacterRace.Elf}>Elf</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="alignment-label">Choose your alignment</InputLabel>
          <Select<EAlignment>
            labelId="alignment-label"
            id="alignment"
            value={character.alignment}
            label="Choose your alignment"
            onChange={(e) => alignmentChanged(e.target.value as EAlignment)}
          >
            <MenuItem value={EAlignment.Neutral}>Neutral</MenuItem>
            <MenuItem value={EAlignment.Good}>Good</MenuItem>
            <MenuItem value={EAlignment.Evil}>Evil</MenuItem>
          </Select>
        </FormControl>
        <TextField
          value={character.name}
          onChange={(e) => nameChanged(e.target.value)}
          id="character-name"
          label="Enter your name"
          fullWidth
        />
        <Button variant="contained" onClick={submitHandler}>
          Continue
        </Button>
      </Stack>
    </Screen>
  );
}
