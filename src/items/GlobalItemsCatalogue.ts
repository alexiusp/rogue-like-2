import { ZeroStats } from "../common/stats";
import { ZeroGuilds } from "../guilds/models";
import { EGuild } from "../guilds/types";
import { TBaseItem } from "./models";

const GlobalItemsCatalogue: { [name: string]: TBaseItem } = {
  "Bronze Dagger": {
    name: "Bronze Dagger",
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
      damage: 3,
    },
    hands: 1,
    swings: 1,
  },
  "Iron Dagger": {
    name: "Iron Dagger",
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
      damage: 6,
    },
    hands: 1,
    swings: 1,
  },
  "Wooden Shield": {
    name: "Wooden Shield",
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
      damage: 6,
    },
    hands: 1,
  },
  "Leather Boots": {
    name: "Leather Boots",
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
  },
  "Leather Belt": {
    name: "Leather Belt",
    picture: "leather_belt.png",
    kind: "belt",
    slot: "belt",
    aligned: true,
    statsRequired: ZeroStats,
    statsBonuses: ZeroStats,
    guildRequired: ZeroGuilds,
    attributes: {
      attack: 1,
    },
    hands: 0,
  },
  "Healing Potion": {
    name: "Healing Potion",
    picture: "potionRed.png",
    kind: "potion",
    spell: "heal",
    aligned: false,
    statsRequired: ZeroStats,
    statsBonuses: ZeroStats,
    guildRequired: ZeroGuilds,
    uses: 5,
  },
};

export default GlobalItemsCatalogue;
