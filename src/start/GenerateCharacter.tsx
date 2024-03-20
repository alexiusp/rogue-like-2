import CasinoIcon from "@mui/icons-material/Casino";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import {
  $characterRace,
  $freePoints,
  characterCreated,
  raceChanged,
} from "../character/state";
import Screen from "../layout/Screen";
import { back, navigate } from "../navigation";
import CharismaInput from "./CharismaInput";
import DexterityInput from "./DexterityInput";
import EnduranceInput from "./EnduranceInput";
import IntelligenceInput from "./IntelligenceInput";
import StrengthInput from "./StrengthInput";
import WisdomInput from "./WisdomInput";

export default function GenerateCharacter() {
  const race = useUnit($characterRace);
  const freePoints = useUnit($freePoints);
  const rerollStats = () => raceChanged(race);
  const submitHandler = () => {
    characterCreated();
    navigate("city");
  };
  return (
    <Screen
      header={
        <>
          <IconButton onClick={() => back()} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Stats
          </Typography>
        </>
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
        <Stack direction="row" spacing={4}>
          <Typography sx={{ lineHeight: "32px", fontSize: "24px" }}>
            Free points to distribute:
          </Typography>
          <Chip label={freePoints} />
          <Chip label="Reroll" icon={<CasinoIcon />} onClick={rerollStats} />
        </Stack>
        <StrengthInput />
        <EnduranceInput />
        <DexterityInput />
        <WisdomInput />
        <IntelligenceInput />
        <CharismaInput />
        <Button variant="contained" onClick={submitHandler}>
          Start game
        </Button>
      </Stack>
    </Screen>
  );
}
