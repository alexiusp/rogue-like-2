import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { $characterIsDead } from "../character/state";
import { waitForRescueTeam } from "./state";

export default function CharacterIsDead() {
  const characterIsDead = useUnit($characterIsDead);
  const waitForRescue = useUnit(waitForRescueTeam);
  return (
    <Dialog open={characterIsDead}>
      <DialogTitle>You are dead!</DialogTitle>
      <DialogContent>
        <Typography>
          You died in the Dungeon. Please wait for some other dungeon explorer
          to find your body and morgue worker to resurrect you.
        </Typography>
        <Typography>
          Remember that there is always a risk of &quot;complications&quot; as
          result of a resurrect spell.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="contained" onClick={waitForRescue}>
          Wait for rescue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
