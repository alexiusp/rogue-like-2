import { calculateShopItemPrice } from "../../items/models";
import { TShopItem } from "./types";

const InitialStoreStock: Array<TShopItem> = [
  {
    item: "Bronze Dagger",
    kind: "equipable",
    isEquipped: false,
    idLevel: 2,
    amount: 2,
    price: calculateShopItemPrice("Bronze Dagger", 2),
  },
  {
    item: "Healing Potion",
    kind: "usable",
    usesLeft: 5,
    idLevel: 2,
    amount: 10,
    price: calculateShopItemPrice("Healing Potion", 10),
  },
];

export default InitialStoreStock;
