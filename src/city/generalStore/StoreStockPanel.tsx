import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  Stack,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import { characterBoughtAnItem } from "../../character/state";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import { TGameItem } from "../../items/models";
import StoreListItem from "./StoreListItem";
import { $generalStore, shopSoldAnItem } from "./state";
import { TShopItem } from "./types";

export default function StoreStockPanel() {
  const storeItems = useUnit($generalStore);
  const [selectedItem, selectItem] = useState<TShopItem | undefined>(undefined);
  const listStyle = {
    p: 0,
    width: "100%",
    border: "1px solid",
    borderColor: "divider",
  };
  const handleItemBuy = () => {
    if (!selectedItem) {
      return;
    }
    shopSoldAnItem(selectedItem);
    let item: TGameItem;
    if (selectedItem.kind === "equipable") {
      item = {
        idLevel: selectedItem.idLevel,
        item: selectedItem.item,
        alignment: selectedItem.alignment,
        kind: "equipable",
        isEquipped: false,
      };
    } else {
      item = {
        idLevel: selectedItem.idLevel,
        item: selectedItem.item,
        alignment: selectedItem.alignment,
        kind: "usable",
        usesLeft: selectedItem.usesLeft,
      };
    }
    characterBoughtAnItem({
      item,
      price: selectedItem.price,
    });
    selectItem(undefined);
  };
  return (
    <Card elevation={2} sx={{ flex: "1 1 50%" }}>
      <CardHeader title="Buy items" />
      <CardContent>
        <List sx={listStyle}>
          {storeItems.map((item, index) => {
            const isLast = index === storeItems.length - 1;
            return (
              <StoreListItem
                key={`${index}-${item.item}`}
                item={item}
                isLast={isLast}
                selected={
                  item.item === selectedItem?.item &&
                  item.alignment === selectedItem.alignment
                }
                onSelect={() => selectItem(item)}
              />
            );
          })}
        </List>
      </CardContent>
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
        footer={
          <>
            <Chip
              label={<Typography>Price: {selectedItem?.price}</Typography>}
            />
            <Stack spacing={1} direction="row">
              <Button variant="contained" onClick={handleItemBuy}>
                buy
              </Button>
              <Button onClick={() => selectItem(undefined)}>cancel</Button>
            </Stack>
          </>
        }
      />
    </Card>
  );
}
