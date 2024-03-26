import { getNullBag } from "./random";

const BaseLevel1ItemLoot: (string | null)[] = [
  "Bronze Dagger",
  "Bronze Dagger",
  "Bronze Dagger",
  "Bronze Dagger",
  "Wooden Shield",
  "Wooden Shield",
  "Leather Boots",
  "Leather Belt",
  "Healing Potion",
  "Healing Potion",
  ...getNullBag(30),
];

const BaseLevel2ItemLoot: (string | null)[] = [
  "Bronze Dagger",
  "Iron Dagger",
  "Iron Dagger",
  "Iron Dagger",
  "Wooden Shield",
  "Leather Boots",
  "Leather Belt",
  "Healing Potion",
  "Healing Potion",
  "Healing Potion",
  ...getNullBag(30),
];

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
