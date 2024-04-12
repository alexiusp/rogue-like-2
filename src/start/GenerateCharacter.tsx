import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { $freePoints, characterCreated } from "../character/state";
import Screen from "../layout/Screen";
import { back, navigate } from "../navigation";
import AlignmentInput from "./AlignmentInput";
import CharismaInput from "./CharismaInput";
import DexterityInput from "./DexterityInput";
import EnduranceInput from "./EnduranceInput";
import GenderInput from "./GenderInput";
import IntelligenceInput from "./IntelligenceInput";
import RaceInput from "./RaceInput";
import StrengthInput from "./StrengthInput";
import WisdomInput from "./WisdomInput";

export default function GenerateCharacter() {
  const freePoints = useUnit($freePoints);
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
            Create character
          </Typography>
        </>
      }
      centered={true}
    >
      <Grid container columnSpacing={1} rowSpacing={1}>
        <Grid xs={4}>
          <Stack spacing={2}>
            <GenderInput />
            <RaceInput />
            <AlignmentInput />
            <Button startIcon={<HelpOutlineIcon />} disabled={true}>
              Race stats
            </Button>
            <Button startIcon={<HelpOutlineIcon />} disabled={true}>
              Guild stats
            </Button>
          </Stack>
        </Grid>
        <Grid xs={4}>
          <Stack spacing={2}>
            <Typography sx={{ lineHeight: "32px", fontSize: "24px" }}>
              Free points to distribute:
            </Typography>
            <Chip label={freePoints} />
            <StrengthInput />
            <EnduranceInput />
            <DexterityInput />
            <WisdomInput />
            <IntelligenceInput />
            <CharismaInput />
          </Stack>
        </Grid>
        <Grid xs={4}>
          here will be a list of all guilds with highlighting those which user
          can join immediately, theoretically and can not join dure to the
          race/alignment restrictions
        </Grid>
        <Grid xsOffset={5} xs={2}>
          <Button
            variant="contained"
            onClick={submitHandler}
            disabled={freePoints > 0}
          >
            Start game
          </Button>
        </Grid>
      </Grid>
    </Screen>
  );
}
