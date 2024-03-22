import { EAlignment } from "../../common/alignment";
import { calculateShopItemPrice } from "../../items/models";
import { TShopItem } from "./types";

export default function getInitialStoreStock(): TShopItem[] {
  return [
    {
      item: "Bronze Dagger",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      price: calculateShopItemPrice("Bronze Dagger", 2),
    },
    {
      item: "Iron Dagger",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Evil,
      price: calculateShopItemPrice("Iron Dagger", 2),
    },
    {
      item: "Iron Dagger",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Neutral,
      price: calculateShopItemPrice("Iron Dagger", 2),
    },
    {
      item: "Iron Dagger",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Good,
      price: calculateShopItemPrice("Iron Dagger", 2),
    },
    {
      item: "Wooden Shield",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      price: calculateShopItemPrice("Wooden Shield", 2),
    },
    {
      item: "Leather Boots",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      price: calculateShopItemPrice("Leather Boots", 2),
    },
    {
      item: "Leather Belt",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Evil,
      price: calculateShopItemPrice("Leather Belt", 2),
    },
    {
      item: "Leather Belt",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Good,
      price: calculateShopItemPrice("Leather Belt", 2),
    },
    {
      item: "Leather Belt",
      kind: "equipable",
      isEquipped: false,
      idLevel: 2,
      amount: 2,
      alignment: EAlignment.Neutral,
      price: calculateShopItemPrice("Leather Belt", 2),
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
}
