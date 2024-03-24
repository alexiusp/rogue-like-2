import { Button, Card, CardContent, CardHeader, Chip } from "@mui/material";
import { useUnit } from "effector-react";
import { useCallback, useEffect, useState } from "react";
import InventoryList from "../../character/InventoryList";
import MoneyStatusBadge from "../../character/MoneyStatusBadge";
import {
  $characterCharisma,
  $characterInventory,
  characterDroppedAnItem,
  characterIdentifiedAnItem,
  characterSoldAnItem,
} from "../../character/state";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import {
  calculateItemIdCost,
  calculateItemPriceToSell,
  itemsAreEqual,
} from "../../items/models";
import { $generalStore, shopBoughtAnItem } from "./state";

export default function CharacterInventoryStoreList() {
  const storeStock = useUnit($generalStore);
  const charisma = useUnit($characterCharisma);
  const inventory = useUnit($characterInventory);
  const [selectedItemIndex, selectIndex] = useState(-1);
  const deselectItemHandler = () => selectIndex(-1);
  const [selectedItemPrice, setPrice] = useState(0);
  const [selectedItemIdCost, setIdCost] = useState(0);
  const recalculatePrices = useCallback(
    (itemIndex: number) => {
      const item = inventory[itemIndex];
      const itemInStock = storeStock.find(itemsAreEqual(item));
      const amountInShop = itemInStock ? itemInStock.amount : 0;
      const price = calculateItemPriceToSell(item, amountInShop, charisma);
      setPrice(price);
      if (item.idLevel < 2) {
        const idCost = calculateItemIdCost(price);
        setIdCost(idCost);
      }
    },
    [storeStock, inventory, charisma],
  );
  useEffect(() => {
    if (selectedItemIndex < 0) {
      return;
    }
    recalculatePrices(selectedItemIndex);
  }, [selectedItemIndex, recalculatePrices]);
  const handleItemSell = () => {
    if (selectedItemIndex < 0) {
      return;
    }
    shopBoughtAnItem(inventory[selectedItemIndex]);
    characterSoldAnItem({
      itemIndex: selectedItemIndex,
      price: selectedItemPrice,
    });
    deselectItemHandler();
  };
  const handleItemDrop = () => {
    if (selectedItemIndex < 0) {
      return;
    }
    characterDroppedAnItem(selectedItemIndex);
    deselectItemHandler();
  };
  const handleId = () => {
    if (selectedItemIndex < 0) {
      return;
    }
    characterIdentifiedAnItem({
      itemIndex: selectedItemIndex,
      price: selectedItemIdCost,
    });
    recalculatePrices(selectedItemIndex);
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
        <InventoryList
          onIndexSelect={selectIndex}
          selectedIndex={selectedItemIndex}
        />
      </CardContent>
      <ItemDetailsDialog
        item={inventory[selectedItemIndex]}
        onClose={deselectItemHandler}
        footer={
          <>
            {selectedItemIndex >= 0 &&
            selectedItemIdCost > 0 &&
            inventory[selectedItemIndex].idLevel < 2 ? (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleId}
                startIcon={<Chip label={selectedItemIdCost} />}
              >
                id
              </Button>
            ) : null}
            <Button
              variant="contained"
              onClick={handleItemSell}
              startIcon={<Chip label={selectedItemPrice} />}
            >
              sell
            </Button>
            <Button onClick={handleItemDrop}>drop</Button>
            <Button onClick={deselectItemHandler}>cancel</Button>
          </>
        }
      />
    </Card>
  );
}
