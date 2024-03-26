import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import chestBg from "../assets/chest-big.webp";
import Screen from "../layout/Screen";
import { forward } from "../navigation";
import { $chest } from "./state";

export default function ChestScreen() {
  const chest = useUnit($chest);
  if (!chest) {
    return null;
  }
  const { isLocked, isOpened, items, money /*, trap*/ } = chest;
  const leaveEncounter = () => {
    forward("dungeon");
  };
  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          A chest!
        </Typography>
      }
    >
      <img
        src={chestBg}
        alt="chest"
        style={{ objectFit: "cover", width: "100%" }}
      />
      <Card elevation={3}>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Typography>You found a chest:</Typography>
            {isLocked ? (
              <Chip label="Magically locked" color="primary" />
            ) : (
              <>
                <Typography component="legend">Trap is #trapname#</Typography>
                <Rating name="read-only" value={2} readOnly />
                <Typography component="legend">Disarm chance:</Typography>
                <Rating name="read-only" value={1} readOnly />
              </>
            )}
            {isOpened ? (
              <Typography>chest content will be here</Typography>
            ) : (
              <Skeleton variant="rounded" height={60} />
            )}
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small">Open</Button>
          <Button size="small" onClick={leaveEncounter}>
            Leave
          </Button>
        </CardActions>
      </Card>
    </Screen>
  );
}
