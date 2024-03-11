import { Button, Chip, Stack, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import InventoryList from "../../character/InventoryList";
import {
  $characterCharisma,
  characterDroppedAnItem,
  characterSoldAnItem,
} from "../../character/state";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import {
  TGameItem,
  calculateItemPriceToSell,
  itemsAreEqual,
} from "../../items/models";
import { $generalStore, shopBoughtAnItem } from "./state";

export default function CharacterInventoryStoreList() {
  const storeStock = useUnit($generalStore);
  const charisma = useUnit($characterCharisma);
  const [selectedItem, selectItem] = useState<TGameItem | undefined>(undefined);
  const [selectedItemPrice, setPrice] = useState(0);
  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    const itemInStock = storeStock.find(itemsAreEqual(selectedItem));
    const amountInShop = itemInStock ? itemInStock.amount : 0;
    const price = calculateItemPriceToSell(
      selectedItem,
      amountInShop,
      charisma,
    );
    setPrice(price);
  }, [selectedItem, storeStock, charisma]);
  const handleItemSell = () => {
    if (!selectedItem) {
      return;
    }
    shopBoughtAnItem(selectedItem);
    characterSoldAnItem({ item: selectedItem, price: selectedItemPrice });
    selectItem(undefined);
  };
  const handleItemDrop = () => {
    if (!selectedItem) {
      return;
    }
    characterDroppedAnItem(selectedItem);
    selectItem(undefined);
  };
  return (
    <>
      <InventoryList onItemSelect={selectItem} selectedItem={selectedItem} />
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
        footer={
          <>
            <Chip label={<Typography>Price: {selectedItemPrice}</Typography>} />
            <Stack spacing={1} direction="row">
              <Button variant="contained" onClick={handleItemSell}>
                sell
              </Button>
              <Button variant="contained" onClick={handleItemDrop}>
                drop
              </Button>
              <Button onClick={() => selectItem(undefined)}>cancel</Button>
            </Stack>
          </>
        }
      />
    </>
  );
}
