import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ItemName from "../../items/ItemName";
import { TGameItem } from "../../items/models";

interface IBankItemsStashProps {
  stash: TGameItem[];
  selected: number;
  onSelect: (index: number) => void;
}

export default function BankItemsStash({
  stash,
  selected,
  onSelect,
}: IBankItemsStashProps) {
  if (!stash.length) {
    return <Typography>Your stash is empty!</Typography>;
  }
  const listStyle = {
    p: 0,
    border: "1px solid",
    borderColor: "divider",
  };
  return (
    <List sx={listStyle}>
      {stash.map((item, index) => (
        <ListItem
          key={index}
          disablePadding
          divider={index !== stash.length - 1}
        >
          <ListItemButton
            selected={index === selected}
            onClick={() => onSelect(index)}
          >
            <ListItemText primary={<ItemName item={item} />} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
