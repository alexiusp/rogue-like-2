import { List, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import InventoryItem from "./InventoryItem";
import { $characterInventory } from "./state";

interface IInventoryListProps {
  selectedIndex?: number;
  onIndexSelect?: (index: number) => void;
}

export default function InventoryList({
  selectedIndex,
  onIndexSelect,
}: IInventoryListProps) {
  const inventory = useUnit($characterInventory);
  const onSelectHandler = (index: number) => () => {
    if (onIndexSelect) {
      onIndexSelect(index);
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
          selected={index === selectedIndex}
          divider={index !== inventory.length - 1}
          onSelect={onSelectHandler(index)}
        />
      ))}
    </List>
  );
}
