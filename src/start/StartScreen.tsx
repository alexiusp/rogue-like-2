import {
  Avatar,
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import {
  $characterAvatar,
  $characterBaseInfo,
  avatarChanged,
  nameChanged,
} from "../character/state";
import { clearCurrentSlot } from "../common/db";
import Screen from "../layout/Screen";
import { back, navigate } from "../navigation";

export default function StartScreen() {
  const baseInfo = useUnit($characterBaseInfo);
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
      centered={true}
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
        <TextField
          value={baseInfo.name}
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
