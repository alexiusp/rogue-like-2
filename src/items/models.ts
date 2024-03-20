import { ICharacterState } from "../character/models";
import { EAlignment, generateRandomAlignment } from "../common/alignment";
import { rollDiceCheck } from "../common/random";
import { TStatsValues, getStatBonus } from "../common/stats";
import {
  getMaxSkillFromGuilds,
  getTotalSkillFromGuilds,
} from "../guilds/models";
import { TGuildValues } from "../guilds/types";
import GlobalItemsCatalogue from "./GlobalItemsCatalogue";

type TItemKind = "dagger" | "potion" | "sword" | "shield";

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
  | "bracers";

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
  // picture of the item
  picture: string;
  // generic name for item when not identified
  kind: TItemKind;
  // item material (price/id calculations will depend on this)
  material?: TMaterial;
  // spell to be cast by every usage (or permanently if equipable)
  spell?: string;
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
  swings: number;
}

export interface IUsableBaseItem extends IBaseItem {
  // amount of uses for usable item
  uses: number;
}

export type TBaseItem = IUsableBaseItem | IEquippableBaseItem;

export function isBaseItemEquippable(
  item: TBaseItem,
): item is IEquippableBaseItem {
  return !!(item as IEquippableBaseItem).slot;
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

export type TGameItem = IEquipmentGameItem | IUsableGameItem;

export const itemsAreEqual =
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
  console.log("calculateShopItemPrice", itemName, basePrice, amountModifier);
  return Math.floor(basePrice * amountModifier);
}

export function calculateItemPriceToSell(
  item: TGameItem,
  amountInShop: number,
  charisma: number,
) {
  const baseShopPrice = calculateShopItemPrice(item.item, amountInShop);
  const baseItem = GlobalItemsCatalogue[item.item];
  const idModifier = item.idLevel === 0 ? 0.01 : item.idLevel === 1 ? 0.1 : 1;
  let usesModifier = 1;
  if (item.kind === "usable") {
    usesModifier = item.usesLeft / (baseItem as IUsableBaseItem).uses;
  }
  const charismaBonus = getStatBonus(charisma);
  const charismaModifier = rollDiceCheck(20 - charismaBonus, "1D20") ? 1.2 : 1;
  console.log(
    "calculateItemPriceToSell",
    baseItem.name,
    baseShopPrice,
    idModifier,
    usesModifier,
    charismaModifier,
  );
  return Math.floor(
    baseShopPrice * idModifier * usesModifier * charismaModifier * 0.8,
  );
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

export function generateRandomItem(
  itemName: string,
  character: ICharacterState,
): TGameItem {
  let idLevel: IdLevel = 0;
  const intBonus = getStatBonus(character.stats.intelligence);
  const wisBonus = getStatBonus(character.stats.wisdom);
  const perceptionSkill = getMaxSkillFromGuilds("perception", character.guilds);
  const thiefSkill = getTotalSkillFromGuilds("thief", character.guilds);
  const skillBonus = 2 * perceptionSkill.max + thiefSkill;
  // two dice checks one for each id level
  const diceCheck1 = rollDiceCheck(
    20 - intBonus - wisBonus - skillBonus,
    "1D20",
  );
  if (diceCheck1) {
    idLevel = 1;
  }
  const diceCheck2 = rollDiceCheck(
    20 - intBonus - wisBonus - skillBonus,
    "1D20",
  );
  if (diceCheck2) {
    idLevel = 2;
  }
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
  const item: IUsableGameItem = {
    ...common,
    kind: "usable",
    usesLeft: baseItem.uses,
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
  const swings = baseItem.swings;
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
  return `Casts spell "${spell}" ${suffix}`;
}
