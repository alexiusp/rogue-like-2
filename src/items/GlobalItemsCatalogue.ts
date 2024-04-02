import { ZeroStats } from "../common/stats";
import { ZeroGuilds } from "../guilds/models";
import { EGuild } from "../guilds/types";
import { IEquippableBaseItem, IUsableBaseItem, TBaseItem } from "./models";

const BronzeDagger: IEquippableBaseItem = {
  name: "Bronze Dagger",
  level: 1,
  picture: "bronze_dagger.png",
  kind: "dagger",
  material: "Bronze",
  slot: "weapon",
  aligned: false,
  statsRequired: {
    strength: 4,
    intelligence: 0,
    wisdom: 0,
    endurance: 0,
    charisma: 0,
    dexterity: 6,
  },
  statsBonuses: ZeroStats,
  guildRequired: ZeroGuilds,
  attributes: {
    attack: 1,
    damage: 3,
  },
  hands: 1,
  swings: 1,
};

const IronDagger: IEquippableBaseItem = {
  name: "Iron Dagger",
  level: 2,
  picture: "iron_dagger.png",
  kind: "dagger",
  material: "Iron",
  slot: "weapon",
  aligned: true,
  statsRequired: {
    strength: 10,
    intelligence: 0,
    wisdom: 0,
    endurance: 0,
    charisma: 0,
    dexterity: 10,
  },
  statsBonuses: ZeroStats,
  guildRequired: [
    { guild: EGuild.Adventurer, value: 3 },
    { guild: EGuild.Thief, value: 5 },
    { guild: EGuild.Warrior, value: 4 },
  ],
  attributes: {
    attack: 1,
    damage: 6,
  },
  hands: 1,
  swings: 1,
};

const WoodenShield: IEquippableBaseItem = {
  name: "Wooden Shield",
  level: 1,
  picture: "wooden_shield.png",
  kind: "shield",
  slot: "shield",
  aligned: false,
  statsRequired: {
    strength: 10,
    intelligence: 0,
    wisdom: 0,
    endurance: 0,
    charisma: 0,
    dexterity: 10,
  },
  statsBonuses: ZeroStats,
  guildRequired: [
    { guild: EGuild.Adventurer, value: 1 },
    { guild: EGuild.Warrior, value: 1 },
  ],
  attributes: {
    attack: 3,
    defenseValue: 1,
    protectionValue: 1,
  },
  hands: 1,
};

const LeatherBoots: IEquippableBaseItem = {
  name: "Leather Boots",
  level: 1,
  picture: "leather_boots.png",
  kind: "boots",
  slot: "feet",
  aligned: false,
  statsRequired: {
    strength: 3,
    intelligence: 0,
    wisdom: 0,
    endurance: 0,
    charisma: 0,
    dexterity: 3,
  },
  statsBonuses: ZeroStats,
  guildRequired: ZeroGuilds,
  attributes: {
    attack: 1,
    defenseValue: 1,
  },
  hands: 0,
};

const LeatherBelt: IEquippableBaseItem = {
  name: "Leather Belt",
  level: 1,
  picture: "leather_belt.png",
  kind: "belt",
  slot: "belt",
  aligned: true,
  statsRequired: ZeroStats,
  statsBonuses: ZeroStats,
  guildRequired: ZeroGuilds,
  attributes: {
    attack: 1,
    defenseValue: 1,
  },
  hands: 0,
};

const HealingPotion: IUsableBaseItem = {
  name: "Healing Potion",
  level: 1,
  picture: "potionRed.png",
  kind: "potion",
  spell: { name: "minor heal", level: 15 },
  aligned: false,
  statsRequired: ZeroStats,
  statsBonuses: ZeroStats,
  guildRequired: ZeroGuilds,
  uses: 5,
};

const RingOfShield: IEquippableBaseItem = {
  name: "Ring of Shield",
  level: 3,
  picture: "",
  kind: "ring",
  slot: "ring",
  aligned: true,
  statsRequired: {
    strength: 10,
    intelligence: 8,
    wisdom: 8,
    endurance: 0,
    charisma: 0,
    dexterity: 3,
  },
  statsBonuses: ZeroStats,
  guildRequired: [
    { guild: EGuild.Adventurer, value: 3 },
    { guild: EGuild.Warrior, value: 4 },
    { guild: EGuild.Thief, value: 5 },
  ],
  attributes: {},
  hands: 1,
  material: "Iron",
  spell: { name: "shield", level: 10 },
};

const AmuletOfUltravision: IEquippableBaseItem = {
  name: "Amulet of Ultravision",
  level: 2,
  picture: "",
  kind: "amulet",
  slot: "amulet",
  aligned: false,
  statsRequired: {
    strength: 0,
    intelligence: 10,
    wisdom: 10,
    endurance: 0,
    charisma: 0,
    dexterity: 0,
  },
  statsBonuses: ZeroStats,
  guildRequired: ZeroGuilds,
  attributes: {},
  hands: 0,
  spell: { name: "see invisible", level: 0 },
};

const GlobalItemsCatalogue: Record<string, TBaseItem> = {
  [BronzeDagger.name]: BronzeDagger,
  [IronDagger.name]: IronDagger,
  [WoodenShield.name]: WoodenShield,
  [LeatherBoots.name]: LeatherBoots,
  [LeatherBelt.name]: LeatherBelt,
  [HealingPotion.name]: HealingPotion,
  [RingOfShield.name]: RingOfShield,
  [AmuletOfUltravision.name]: AmuletOfUltravision,
};

export default GlobalItemsCatalogue;

export function getItemsListForLevel(level: number) {
  const itemsList: string[] = [];
  for (const itemName in GlobalItemsCatalogue) {
    const item = GlobalItemsCatalogue[itemName];
    if (item.level <= level) {
      itemsList.push(itemName);
    }
  }
  return itemsList;
}
