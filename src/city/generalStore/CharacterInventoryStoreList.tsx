import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import InventoryList from "../../character/InventoryList";
import MoneyStatusBadge from "../../character/MoneyStatusBadge";
import {
  $characterCharisma,
  characterDroppedAnItem,
  characterSoldAnItem,
} from "../../character/state";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import {
  TGameItem,
  calculateItemIdCost,
  calculateItemPriceToSell,
  itemsAreEqual,
} from "../../items/models";
import { $generalStore, shopBoughtAnItem } from "./state";

export default function CharacterInventoryStoreList() {
  const storeStock = useUnit($generalStore);
  const charisma = useUnit($characterCharisma);
  const [selectedItem, selectItem] = useState<TGameItem | undefined>(undefined);
  const [selectedItemPrice, setPrice] = useState(0);
  const [selectedItemIdCost, setIdCost] = useState(0);
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
    if (selectedItem.idLevel < 2) {
      const idCost = calculateItemIdCost(price);
      setIdCost(idCost);
    }
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
  const handleId = () => {
    //
  };
  return (
    <Card elevation={2} sx={{ flex: "1 1 50%" }}>
      <CardHeader
        title={
          <>
            Inventory <MoneyStatusBadge />
          </>
        }
      />
      <CardContent>
        <InventoryList onItemSelect={selectItem} selectedItem={selectedItem} />
      </CardContent>
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
        footer={
          <>
            <Chip label={<Typography>Price: {selectedItemPrice}</Typography>} />
            <Stack spacing={1} direction="row">
              {selectedItemIdCost > 0 ? (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleId}
                  startIcon={<Chip label={selectedItemIdCost} />}
                >
                  id
                </Button>
              ) : null}
              <Button variant="contained" onClick={handleItemSell}>
                sell
              </Button>
              <Button onClick={handleItemDrop}>drop</Button>
              <Button onClick={() => selectItem(undefined)}>cancel</Button>
            </Stack>
          </>
        }
      />
    </Card>
  );
}
