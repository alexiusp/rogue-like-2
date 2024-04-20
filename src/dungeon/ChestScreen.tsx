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
import { useState } from "react";
import chestBg from "../assets/chest-big.webp";
import {
  characterReceivedItems,
  moneyAddedToCharacter,
} from "../character/state";
import MoneyLabel from "../components/MoneyLabel/MoneyLabel";
import ItemDetailsDialog from "../items/ItemDetailsDialog";
import ItemIcon from "../items/ItemIcon";
import { TGameItem } from "../items/models";
import Screen from "../layout/Screen";
import { forward } from "../navigation";
import { $chest, chestContentsPickedUp, chestIsOpened } from "./state";

export default function ChestScreen() {
  const [selectedItem, selectItem] = useState<TGameItem | undefined>(undefined);
  const chest = useUnit($chest);
  if (!chest) {
    return null;
  }
  const { isLocked, isOpened, items, money /*, trap*/ } = chest;
  const leaveEncounter = () => {
    forward("dungeon");
  };
  const collectItemsFromChest = () => {
    moneyAddedToCharacter(money);
    characterReceivedItems(items);
    chestContentsPickedUp();
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
              <>
                <MoneyLabel amount={money} />
                <Stack spacing={2} direction="row">
                  {items.map((item, index) => (
                    <Button
                      variant="outlined"
                      key={`${index}-${item.item}`}
                      onClick={() => selectItem(item)}
                    >
                      <ItemIcon item={item.item} />
                    </Button>
                  ))}
                </Stack>
              </>
            ) : (
              <Skeleton variant="rounded" height={60} />
            )}
          </Stack>
        </CardContent>
        <CardActions>
          {!isOpened ? (
            <Button
              size="small"
              disabled={isLocked}
              onClick={() => chestIsOpened()}
            >
              Open
            </Button>
          ) : (
            <Button size="small" onClick={collectItemsFromChest}>
              Collect
            </Button>
          )}
          <Button size="small" onClick={leaveEncounter}>
            Leave
          </Button>
        </CardActions>
      </Card>
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
        footer={<Button onClick={() => selectItem(undefined)}>OK</Button>}
      />
    </Screen>
  );
}
