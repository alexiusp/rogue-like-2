import {
  Avatar,
  Box,
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
import { ECharacterRace } from "../character/races";
import {
  $character,
  $characterAvatar,
  alignmentChanged,
  avatarChanged,
  genderChanged,
  nameChanged,
  raceChanged,
} from "../character/state";
import { EGender } from "../character/types";
import { EAlignment } from "../common/alignment";
import { clearCurrentSlot } from "../common/db";
import Screen from "../layout/Screen";
import { back, navigate } from "../navigation";

export default function StartScreen() {
  const character = useUnit($character);
  const submitHandler = () => {
    navigate("generate");
  };
  const nextAvatar = () => {
    const number = Number(characterAvatar.substring(0, 2));
    const nextNumber = `${number + 1}`.padStart(2, "0");
    avatarChanged(`${nextNumber}.png`);
  };
  const prevAvatar = () => {
    const number = Number(characterAvatar.substring(0, 2));
    const nextNumber = `${number - 1}`.padStart(2, "0");
    avatarChanged(`${nextNumber}.png`);
  };
  const cancelHandler = () => {
    clearCurrentSlot();
    back();
  };
  const characterAvatar = useUnit($characterAvatar);
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
        <Stack spacing={2} alignItems="center">
          <InputLabel id="picture-label">Choose your avatar</InputLabel>
          <Avatar
            alt="character's avatar"
            src={`/src/assets/avatars/${characterAvatar}`}
            sx={{ width: "128px", height: "128px" }}
          />
          <Box>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={prevAvatar}
              disabled={characterAvatar === "01.png"}
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={nextAvatar}
              disabled={characterAvatar === "10.png"}
            >
              &gt;
            </Button>
          </Box>
        </Stack>
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
        <Button onClick={cancelHandler} color="warning">
          cancel
        </Button>
      </Stack>
    </Screen>
  );
}
