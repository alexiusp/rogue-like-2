import { List, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { useCallback } from "react";
import { TGameItem, itemsAreSame } from "../items/models";
import InventoryItem from "./InventoryItem";
import { $characterInventory } from "./state";

interface IInventoryListProps {
  selectedItem?: TGameItem;
  onItemSelect?: (item: TGameItem) => void;
  onIndexSelect?: (index: number) => void;
}

export default function InventoryList({
  selectedItem,
  onItemSelect,
  onIndexSelect,
}: IInventoryListProps) {
  const inventory = useUnit($characterInventory);
  const itemComparison = useCallback(
    (item: TGameItem) => selectedItem && itemsAreSame(selectedItem)(item),
    [selectedItem],
  );
  const onSelectHandler = (index: number) => () => {
    if (onIndexSelect) {
      onIndexSelect(index);
    }
    if (onItemSelect) {
      const item = inventory[index];
      onItemSelect(item);
    }
  };
  if (!inventory.length) {
    return <Typography>Your inventory is empty!</Typography>;
  }
  const listStyle = {
    p: 0,
    border: "1px solid",
    borderColor: "divider",
  };
  return (
    <List sx={listStyle}>
      {inventory.map((item, index) => (
        <InventoryItem
          key={`${index}-${item.item}`}
          item={item}
          selected={itemComparison(item)}
          divider={index !== inventory.length - 1}
          onSelect={onSelectHandler(index)}
        />
      ))}
    </List>
  );
}
