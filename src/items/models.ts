import { EAlignment, generateRandomAlignment } from "../common/alignment";
import { RandomBag, getRandomInt, rollDiceCheck } from "../common/random";
import { TStatsValues, ZeroStats, getStatBonus } from "../common/stats";
import { TGuildValues } from "../guilds/types";
import { isSpellCombat, isSpellNonCombat } from "../magic/models";
import { IGameSpell } from "../magic/types";
import GlobalItemsCatalogue, {
  getItemsListForLevel,
} from "./GlobalItemsCatalogue";

type TItemKind =
  | "dagger"
  | "potion"
  | "sword"
  | "shield"
  | "boots"
  | "belt"
  | "ring"
  | "amulet"
  | "stone"
  | "book";

type TSlot =
  | "head"
  | "armor"
  | "weapon"
  | "shield"
  | "feet"
  | "cloak"
  | "ring"
  | "amulet"
  | "gloves"
  | "bracers"
  | "belt";

type TMaterial = "Bronze" | "Iron" | "Steel" | "Adamantine" | "Mithril";

interface IItemAttributes {
  attack?: number;
  damage?: number;
  defenseValue?: number;
  protectionValue?: number;
}

// base information about an item
export interface IBaseItem {
  // unique name of the item
  name: string;
  // level used for random generation of chests etc.
  level: number;
  // picture of the item
  picture: string;
  // generic name for item when not identified
  kind: TItemKind;
  // item material (price/id calculations will depend on this)
  material?: TMaterial;
  // spell to be cast by every usage (or permanently if equipable)
  spell?: IGameSpell;
  // requires alignment to be used/equipped
  aligned: boolean;
  // requires stats to be used/equipped
  statsRequired: TStatsValues;
  // requires guild level to be used/equipped
  guildRequired: TGuildValues;
  // bonuses to stats when item is equipped or used
  statsBonuses: TStatsValues;
}

export interface IEquippableBaseItem extends IBaseItem {
  // if item is equipable it must have a slot defined
  slot: TSlot;
  // attributes for the item if equipable
  attributes: IItemAttributes;
  // amount of hands required
  hands: number;
  // amount of swings done per battle tick (for weapon slot)
  swings?: number;
}

// usable items always have uses, permanent spells can be only on equippable items
export interface IUsableBaseItem extends IBaseItem {
  // amount of uses for usable item
  uses: number;
  // spell must be defined for usable item
  spell: IGameSpell;
}

export interface IStatsBaseItem extends IBaseItem {}

export type TBaseItem = IUsableBaseItem | IEquippableBaseItem | IStatsBaseItem;

export function isBaseItemEquippable(
  item: TBaseItem,
): item is IEquippableBaseItem {
  return !!(item as IEquippableBaseItem).slot;
}

export function isBaseItemUsable(item: TBaseItem): item is IUsableBaseItem {
  return typeof item.spell !== "undefined";
}

export function isStatsBaseItem(item: TBaseItem): item is IStatsBaseItem {
  return !isBaseItemEquippable(item) && !isBaseItemUsable(item);
}

export type IdLevel = 0 | 1 | 2; //0 - unidentified, 1 - partially identified, 2 - fully identified

// additional properties of a particular item generated in the game
export interface IGameItem {
  item: string;
  alignment?: EAlignment; // particular alignment if applicable
  idLevel: IdLevel; // identification level
}

export interface IEquipmentGameItem extends IGameItem {
  kind: "equipable";
  isEquipped: boolean;
}

export interface IUsableGameItem extends IGameItem {
  kind: "usable";
  usesLeft: number;
}

export interface IStatsGameItem extends IGameItem {
  kind: "stats";
}

export type TGameItem = IEquipmentGameItem | IUsableGameItem | IStatsGameItem;

/** This comparison is used to find identical items - all properties must match */
export const itemsAreSame =
  <T extends TGameItem, V extends TGameItem>(itemToCompare: T) =>
  (item: V) => {
    const nameMatch = item.item === itemToCompare.item;
    const alignMatch = item.alignment === itemToCompare.alignment;
    const idMatch = item.idLevel === itemToCompare.idLevel;
    if (!nameMatch || !alignMatch || !idMatch) {
      return false;
    }
    if (itemToCompare.kind === "usable" && item.kind === "usable") {
      return itemToCompare.usesLeft === item.usesLeft;
    }
    return true;
  };

/** This comparison is used to find similar items to count amount of items in shop */
export const itemsAreEqual =
  <T extends TGameItem, V extends TGameItem>(itemToCompare: T) =>
  (item: V) => {
    const nameMatch = item.item === itemToCompare.item;
    const alignMatch = item.alignment === itemToCompare.alignment;
    if (!nameMatch || !alignMatch) {
      return false;
    }
    return true;
  };

// calculate item base price considering it base properties
export function calculateBaseItemPrice({
  kind,
  aligned,
  material,
  spell,
}: TBaseItem) {
  // differend kind of items might have different base prices
  let baseItemKindPrice: number;
  switch (kind) {
    case "dagger":
      baseItemKindPrice = 10;
      break;
    case "potion":
      baseItemKindPrice = 50;
      break;
    case "shield":
      baseItemKindPrice = 10;
      break;
    case "sword":
      baseItemKindPrice = 10;
      break;
    default:
      baseItemKindPrice = 10;
      break;
  }
  // if item is aligned it will cost less because of this restriction
  const alignmentModifier = aligned ? 0.9 : 1;
  // the better the material the higher the cost
  let materialModifier: number;
  switch (material) {
    case "Bronze":
      materialModifier = 1;
      break;
    case "Iron":
      materialModifier = 1.5;
      break;
    case "Steel":
      materialModifier = 2;
      break;
    case "Adamantine":
      materialModifier = 3;
      break;
    case "Mithril":
      materialModifier = 5;
      break;
    default:
      materialModifier = 1;
  }
  // if item has magical enchantment it will cost much higher
  // implement different modifiers for different spells
  const magicalModifier = spell ? 3 : 1;
  return (
    baseItemKindPrice * alignmentModifier * materialModifier * magicalModifier
  );
}

export function calculateShopItemPrice(itemName: string, amountInShop: number) {
  const item = GlobalItemsCatalogue[itemName];
  const basePrice = calculateBaseItemPrice(item);
  const amountModifier =
    amountInShop <= 0 ? 10 : 1 + (10 - Math.min(10, amountInShop)) * 0.1;
  return Math.floor(basePrice * amountModifier);
}

export function calculateItemPriceToSell(
  item: TGameItem,
  amountInShop: number,
  charisma: number,
) {
  const baseShopPrice = calculateShopItemPrice(item.item, amountInShop);
  const baseItem = GlobalItemsCatalogue[item.item];
  const idModifier = item.idLevel === 0 ? 0.5 : item.idLevel === 1 ? 0.8 : 1;
  let spellModifier = 1;
  if (item.kind === "usable" && isBaseItemUsable(baseItem)) {
    spellModifier = (10 * item.usesLeft) / baseItem.uses;
  }
  if (isBaseItemEquippable(baseItem) && baseItem.spell) {
    spellModifier = 100;
  }
  const charismaBonus = getStatBonus(charisma);
  const charismaModifier = rollDiceCheck(20 - charismaBonus, "1D20") ? 1.2 : 1;
  return Math.floor(
    baseShopPrice * idModifier * spellModifier * charismaModifier * 0.8,
  );
}

export function calculateItemIdCost(priceToSell: number) {
  return Math.floor(priceToSell * 0.6);
}

export function getItemAttribute<K extends keyof IItemAttributes>(
  attribute: K,
  item: TGameItem,
): IItemAttributes[K] | undefined {
  if (item.kind !== "equipable") {
    return undefined;
  }
  const baseItem = GlobalItemsCatalogue[item.item] as IEquippableBaseItem;
  const value = baseItem.attributes[attribute];
  return value;
}

export function getItemAttack(item: TGameItem) {
  return getItemAttribute("attack", item) ?? 0;
}

export function getEquippedItemsAttack(items: TGameItem[]) {
  return items.reduce((sum, item) => {
    if (item.kind === "equipable" && item.isEquipped) {
      // summarize only equipped items
      return sum + getItemAttack(item);
    }
    return sum;
  }, 0);
}

export function getItemDamage(item: TGameItem) {
  return getItemAttribute("damage", item) ?? 0;
}

export function getEquippedItemsDamage(items: TGameItem[]) {
  return items.reduce((sum, item) => {
    if (item.kind === "equipable" && item.isEquipped) {
      // summarize only equipped items
      return sum + getItemDamage(item);
    }
    return sum;
  }, 0);
}

export function getItemDefense(item: TGameItem) {
  return getItemAttribute("defenseValue", item) ?? 0;
}

export function getEquippedItemsDefense(items: TGameItem[]) {
  return items.reduce((sum, item) => {
    if (item.kind === "equipable" && item.isEquipped) {
      // summarize only equipped items
      return sum + getItemDefense(item);
    }
    return sum;
  }, 0);
}

export function getItemProtection(item: TGameItem) {
  return getItemAttribute("protectionValue", item) ?? 0;
}

export function getEquippedItemsProtection(items: TGameItem[]) {
  return items.reduce((sum, item) => {
    if (item.kind === "equipable" && item.isEquipped) {
      // summarize only equipped items
      return sum + getItemProtection(item);
    }
    return sum;
  }, 0);
}

export function generateRandomItemByName(
  itemName: string,
  idLevel: IdLevel = 0,
): TGameItem {
  const baseItem = GlobalItemsCatalogue[itemName];
  const common: IGameItem = {
    idLevel,
    item: itemName,
  };
  if (baseItem.aligned) {
    common.alignment = generateRandomAlignment();
  }
  if (isBaseItemEquippable(baseItem)) {
    const item: IEquipmentGameItem = {
      ...common,
      isEquipped: false,
      kind: "equipable",
    };
    return item;
  }
  if (isBaseItemUsable(baseItem)) {
    const item: IUsableGameItem = {
      ...common,
      kind: "usable",
      usesLeft: baseItem.uses,
    };
    return item;
  }
  const item: IStatsGameItem = {
    ...common,
    kind: "stats",
  };
  return item;
}

export function getHandsStatusLabel(baseItem: TBaseItem) {
  if (!isBaseItemEquippable(baseItem)) {
    return "Item requires no hands.";
  }
  if (baseItem.hands === 0) {
    return "Item requires no hands.";
  }
  const hands = baseItem.hands > 1 ? "Two" : "One";
  const swings = baseItem.swings ?? 0;
  const swingsSuffix =
    swings > 0 ? `, ${swings} swing${swings > 1 ? "s" : ""}` : ".";
  return `${hands}-handed item${swingsSuffix}`;
}

export function getItemSpellStatusLabel(baseItem: TBaseItem) {
  const { spell } = baseItem;
  if (!spell) {
    return "";
  }
  let suffix = "when used";
  if (isBaseItemEquippable(baseItem)) {
    suffix = "when equipped";
  }
  const level = spell.level ? `level ${spell.level}` : "casters spell level";
  return `Casts spell "${spell.name}" at ${level} ${suffix}`;
}

export function getItemStatsModLabel(baseItem: TBaseItem) {
  if (isStatsBaseItem(baseItem)) {
    return "Modifies Stat(s)";
  }
  return "";
}

export function getItemStatsBonuses(itemName: string) {
  const baseItem = GlobalItemsCatalogue[itemName];
  return baseItem.statsBonuses;
}

export function getItemsStatsBonuses(items: TGameItem[]) {
  const bonuses: TStatsValues = {
    ...ZeroStats,
  };
  for (const item of items) {
    const itemBonuses = getItemStatsBonuses(item.item);
    bonuses.strength += itemBonuses.strength;
    bonuses.intelligence += itemBonuses.intelligence;
    bonuses.wisdom += itemBonuses.wisdom;
    bonuses.endurance += itemBonuses.endurance;
    bonuses.charisma += itemBonuses.charisma;
    bonuses.dexterity += itemBonuses.dexterity;
  }
  return bonuses;
}

export function generateItemsForChest(level: number) {
  const amount = getRandomInt(3, 1);
  const possibleItems = getItemsListForLevel(level);
  const bag = new RandomBag(possibleItems);
  const items = new Array(amount).fill(null).map(() => {
    const itemName = bag.getRandomItem();
    return generateRandomItemByName(itemName);
  });
  console.log("items for chest generated", items);
  return items;
}

export function isItemUsable(item: TGameItem): item is IUsableGameItem {
  return item.kind === "usable";
}

export function isItemEquipable(item: TGameItem): item is IEquipmentGameItem {
  return item.kind === "equipable";
}

export function itemCanBeUsed(item: TGameItem): item is IUsableGameItem {
  if (!isItemUsable(item)) {
    return false;
  }
  return item.usesLeft > 0;
}

export function filterUsable(items: TGameItem[]) {
  return items.reduce((usableItems, item) => {
    if (itemCanBeUsed(item)) {
      usableItems.push(item);
    }
    return usableItems;
  }, [] as IUsableGameItem[]);
}

export function itemCanBeUsedInDungeon(
  item: TGameItem,
): item is IUsableGameItem {
  if (!isItemUsable(item)) {
    return false;
  }
  const baseitem = GlobalItemsCatalogue[item.item];
  if (!isBaseItemUsable(baseitem)) {
    return false;
  }
  const spell = baseitem.spell;
  return isSpellNonCombat(spell.name);
}

export function filterUsableInDungeon(items: TGameItem[]) {
  return items.filter(itemCanBeUsedInDungeon);
}

export function itemCanBeUsedInBattle(
  item: TGameItem,
): item is IUsableGameItem {
  if (!isItemUsable(item)) {
    return false;
  }
  const baseitem = GlobalItemsCatalogue[item.item];
  if (!isBaseItemUsable(baseitem)) {
    return false;
  }
  const spell = baseitem.spell;
  return isSpellCombat(spell.name);
}

export function filterUsableInBattle(items: TGameItem[]) {
  return items.filter(itemCanBeUsedInBattle);
}
