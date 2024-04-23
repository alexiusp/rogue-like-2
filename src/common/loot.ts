import {
  BronzeDagger,
  HealingPotion,
  IronDagger,
  WoodenShield,
  getItemsListForLevel,
} from "../items/GlobalItemsCatalogue";
import { getNullBag, padWithNulls } from "./random";

const BaseLevel1ItemLoot: (string | null)[] = padWithNulls(
  [
    ...getItemsListForLevel(1),
    BronzeDagger.name,
    BronzeDagger.name,
    BronzeDagger.name,
    WoodenShield.name,
    HealingPotion.name,
  ],
  40,
);

const BaseLevel2ItemLoot: (string | null)[] = padWithNulls(
  [
    ...getItemsListForLevel(1),
    ...getItemsListForLevel(2),
    IronDagger.name,
    IronDagger.name,
    HealingPotion.name,
    HealingPotion.name,
  ],
  50,
);

export const ItemLootByLevel = [[], BaseLevel1ItemLoot, BaseLevel2ItemLoot];

const BaseLevel1MoneyLoot: (number | null)[] = [
  50,
  50,
  20,
  20,
  20,
  10,
  10,
  10,
  10,
  null,
];

const BaseLevel2MoneyLoot: (number | null)[] = [
  100,
  100,
  50,
  50,
  50,
  20,
  20,
  20,
  20,
  20,
  ...getNullBag(2),
];

export const MoneyLootByLevel = [[], BaseLevel1MoneyLoot, BaseLevel2MoneyLoot];
