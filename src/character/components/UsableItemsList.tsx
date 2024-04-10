import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import ItemIcon from "../../items/ItemIcon";
import { filterUsable, itemCanBeUsed } from "../../items/models";
import { $characterInventory, characterUsesAnItem } from "../state";
import "./UsableItemsList.css";

export default function UsableItemsList() {
  const allItems = useUnit($characterInventory);
  const handleUseItem = (index: number) => () => characterUsesAnItem(index);
  if (!filterUsable(allItems).length) {
    return <Typography>You have no usable items in your inventory</Typography>;
  }
  return (
    <ToggleButtonGroup size="large" className="usable-items-list">
      {allItems.map((item, index) => {
        if (!itemCanBeUsed(item)) {
          return null;
        }
        return (
          <ToggleButton
            size="large"
            value={item.item}
            key={`usable-items-list-${item.item}-${index}`}
            onClick={handleUseItem(index)}
          >
            <ItemIcon item={item.item} />
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
