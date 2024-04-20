import {
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import ItemIcon from "../../items/ItemIcon";
import {
  filterUsable,
  filterUsableInBattle,
  filterUsableInDungeon,
  itemCanBeUsed,
  itemCanBeUsedInBattle,
  itemCanBeUsedInDungeon,
} from "../../items/models";
import { $characterInventory, characterUsesAnItem } from "../state";
import "./UsableItemsList.css";

interface IUsableItemsListProps {
  filter?: "all" | "dungeon" | "battle";
}

export default function UsableItemsList({
  filter = "all",
}: IUsableItemsListProps) {
  const allItems = useUnit($characterInventory);
  const [selectedItem, selectItem] = useState(-1);
  const handleUseItem = (index: number) => () => {
    selectItem(index);
    characterUsesAnItem(index);
  };
  let checkFn = itemCanBeUsed;
  let filterFn = filterUsable;
  switch (filter) {
    case "battle":
      checkFn = itemCanBeUsedInBattle;
      filterFn = filterUsableInBattle;
      break;
    case "dungeon":
      checkFn = itemCanBeUsedInDungeon;
      filterFn = filterUsableInDungeon;
      break;
  }
  if (!filterFn(allItems).length) {
    return <Typography>You have no usable items in your inventory</Typography>;
  }
  return (
    <ToggleButtonGroup
      size="large"
      className="usable-items-list"
      value={selectedItem}
    >
      {allItems.map((item, index) => {
        if (!checkFn(item)) {
          return null;
        }
        return (
          <ToggleButton
            disabled={item.usesLeft === 0}
            size="large"
            value={index}
            key={`usable-items-list-${item.item}-${index}`}
            onClick={handleUseItem(index)}
          >
            <Badge
              showZero={true}
              badgeContent={item.usesLeft}
              color={index === selectedItem ? "warning" : "primary"}
            >
              <ItemIcon item={item.item} />
            </Badge>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
