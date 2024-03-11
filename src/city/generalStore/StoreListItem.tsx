import {
  Avatar,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { EAlignment, getAlignmentShort } from "../../common/alignment";
import { TShopItem } from "./types";

interface IStoreListItemProps {
  item: TShopItem;
  isLast?: boolean;
  selected: boolean;
  onSelect: () => void;
}

export default function StoreListItem({
  isLast,
  item,
  selected,
  onSelect,
}: IStoreListItemProps) {
  const { amount, item: itemName, alignment } = item;
  const alignmentChip =
    typeof alignment !== "undefined" ? (
      <Chip
        variant="outlined"
        size="small"
        avatar={<Avatar>{getAlignmentShort(alignment)}</Avatar>}
        label={EAlignment[alignment]}
      />
    ) : null;
  return (
    <ListItem
      disablePadding
      divider={!isLast}
      secondaryAction={<Chip label={amount} variant="outlined" />}
    >
      <ListItemButton selected={selected} onClick={() => onSelect()}>
        <ListItemText
          primary={
            <>
              {itemName} {alignmentChip}
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
