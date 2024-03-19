import { createEvent, createStore } from "effector";
import { loadCharacterData, saveCharacterData } from "../../common/db";
import {
  TGameItem,
  calculateShopItemPrice,
  itemsAreEqual,
} from "../../items/models";
import initialStock from "./InitialStoreStock";
import { TShopItem } from "./types";

const startState = (() => {
  const cachedData = loadCharacterData<Array<TShopItem>>("general-store");
  return cachedData !== null ? cachedData : initialStock;
})();
export const $generalStore = createStore<Array<TShopItem>>(startState);

export const storeStateSaved = createEvent();
$generalStore.on(storeStateSaved, (state) => {
  saveCharacterData("general-store", state);
  return state;
});
export const storeStateLoaded = createEvent();
$generalStore.on(storeStateLoaded, (state) => {
  const storeState = loadCharacterData<Array<TShopItem>>("general-store");
  if (!storeState) {
    return state;
  }
  return storeState;
});

export const shopSoldAnItem = createEvent<TShopItem>();
$generalStore.on(shopSoldAnItem, (currentItems, soldItem) => {
  // implement buy and recalculate the price
  const newStock = [...currentItems];
  const itemIndex = newStock.findIndex(itemsAreEqual(soldItem));
  if (itemIndex < 0) {
    throw new Error("Item to sold not found in store stock!");
  }
  if (soldItem.amount <= 1) {
    // if its the last item - remove it from stock
    newStock.splice(itemIndex, 1);
  } else {
    // if there are more items - recalculate amount and price
    const newAmount = soldItem.amount - 1;
    const newPrice = calculateShopItemPrice(soldItem.item, newAmount);
    newStock.splice(itemIndex, 1, {
      ...soldItem,
      amount: newAmount,
      price: newPrice,
    });
  }
  return newStock;
});

export const shopBoughtAnItem = createEvent<TGameItem>();
$generalStore.on(shopBoughtAnItem, (currentItems, boughtItem) => {
  const newStock = [...currentItems];
  const itemIndex = newStock.findIndex((item) => {
    const nameMatch = item.item === boughtItem.item;
    const alignMatch = item.alignment === boughtItem.alignment;
    if (!nameMatch || !alignMatch) {
      return false;
    }
    if (boughtItem.kind === "usable" && item.kind === "usable") {
      return boughtItem.usesLeft === item.usesLeft;
    }
    return true;
  });
  if (itemIndex < 0) {
    newStock.push({
      ...boughtItem,
      amount: 1,
      price: calculateShopItemPrice(boughtItem.item, 1),
      idLevel: 2,
    });
    return newStock;
  }
  const shopItem = newStock[itemIndex];
  const newAmount = shopItem.amount + 1;
  const newPrice = calculateShopItemPrice(shopItem.item, newAmount);
  newStock.splice(itemIndex, 1, {
    ...shopItem,
    amount: newAmount,
    price: newPrice,
  });
  return newStock;
});
