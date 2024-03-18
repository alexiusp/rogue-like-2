import { createEvent, createStore } from "effector";
import { EAlignment } from "../common/alignment";
import { loadData, saveData, setSlotName } from "../common/db";
import { EGuild, GuildXpRequirements } from "../common/guilds";
import { TGameItem, itemsAreEqual } from "../items/models";
import {
  EGender,
  ICharacterState,
  createNewCharacter,
  findCharacterGuildIndex,
  getCharacterGuild,
  rerollStat,
} from "./models";
import { ECharacterRace } from "./races";

const fallbackState: ICharacterState = {
  alignment: EAlignment.Good,
  gender: EGender.Other,
  name: "PlayerName",
  picture: "",
  race: ECharacterRace.Human,
  stats: {
    strength: rerollStat("strength", ECharacterRace.Human),
    endurance: rerollStat("endurance", ECharacterRace.Human),
    dexterity: rerollStat("dexterity", ECharacterRace.Human),
    wisdom: rerollStat("wisdom", ECharacterRace.Human),
    intelligence: rerollStat("intelligence", ECharacterRace.Human),
    charisma: rerollStat("charisma", ECharacterRace.Human),
  },
  age: 0,
  guild: EGuild.Adventurer,
  guilds: [],
  hp: 0,
  hpMax: 0,
  items: [],
  money: 0,
  mp: 0,
  mpMax: 0,
};
const startState = (() => {
  const cachedData = loadData<ICharacterState>("character");
  return cachedData !== null ? cachedData : fallbackState;
})();

export const $character = createStore<ICharacterState>(startState);

export const $characterRace = $character.map((character) => character.race);

export const nameChanged = createEvent<string>();
$character.on(nameChanged, (_, name) => ({ ..._, name }));

export const genderChanged = createEvent<EGender>();
$character.on(genderChanged, (_, gender) => ({ ..._, gender }));

export const raceChanged = createEvent<ECharacterRace>();
$character.on(raceChanged, (character, race) => {
  // reroll initial stats for given race
  const strength = rerollStat("strength", race);
  const endurance = rerollStat("endurance", race);
  const dexterity = rerollStat("dexterity", race);
  const wisdom = rerollStat("wisdom", race);
  const intelligence = rerollStat("intelligence", race);
  const charisma = rerollStat("charisma", race);
  return {
    ...character,
    race,
    stats: {
      strength,
      endurance,
      dexterity,
      wisdom,
      intelligence,
      charisma,
    },
  };
});

export const alignmentChanged = createEvent<EAlignment>();
$character.on(alignmentChanged, (_, align) => ({ ..._, align }));

export const $freePoints = createStore<number>(6);
export const freePointsChanged = createEvent<number>();
// reset free points on race change
$freePoints.reset(raceChanged);
$freePoints.on(freePointsChanged, (oldValue, newValue) => oldValue - newValue);

export const $characterStrength = $character.map(
  (character) => character.stats.strength,
);
export const strengthChanged = createEvent<number>();
$character.on(strengthChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, strength: value },
}));

export const $characterEndurance = $character.map(
  (character) => character.stats.endurance,
);
export const enduranceChanged = createEvent<number>();
$character.on(enduranceChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, endurance: value },
}));

export const $characterDexterity = $character.map(
  (character) => character.stats.dexterity,
);
export const dexterityChanged = createEvent<number>();
$character.on(dexterityChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, dexterity: value },
}));

export const $characterWisdom = $character.map(
  (character) => character.stats.wisdom,
);
export const wisdomChanged = createEvent<number>();
$character.on(wisdomChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, wisdom: value },
}));

export const $characterIntelligence = $character.map(
  (character) => character.stats.intelligence,
);
export const intelligenceChanged = createEvent<number>();
$character.on(intelligenceChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, intelligence: value },
}));

export const $characterCharisma = $character.map(
  (character) => character.stats.charisma,
);
export const charismaChanged = createEvent<number>();
$character.on(charismaChanged, (_, value) => ({
  ..._,
  stats: { ..._.stats, charisma: value },
}));

export const characterCreated = createEvent();
$character.on(characterCreated, (state) => {
  const newState = createNewCharacter(state);
  const saveSlotName = `${state.name} - ${EGender[state.gender]} ${ECharacterRace[state.race]} (${EGuild[state.guild]})`;
  setSlotName(saveSlotName);
  saveData("character", newState);
  return newState;
});
export const characterSaved = createEvent();
$character.on(characterSaved, (state) => {
  const saveSlotName = `${state.name} - ${EGender[state.gender]} ${ECharacterRace[state.race]} (${EGuild[state.guild]})`;
  setSlotName(saveSlotName);
  saveData("character", state);
  return state;
});
export const characterLoaded = createEvent();
$character.on(characterLoaded, (state) => {
  const character = loadData<ICharacterState>("character");
  if (!character) {
    return state;
  }
  return { ...state, ...character };
});

$character.watch(console.log);

export const $characterHealth = $character.map((character) => character.hp);
export const characterHpChanged = createEvent<number>();
$character.on(characterHpChanged, (character, hp) => {
  return {
    ...character,
    hp,
  };
});

export const $characterMaxHealth = $character.map(
  (character) => character.hpMax,
);

export const $characterMoney = $character.map((character) => character.money);
export const moneyAddedToCharacter = createEvent<number>();
$character.on(moneyAddedToCharacter, (_, amount) => ({
  ..._,
  money: _.money + amount,
}));
export const moneyRemovedFromCharacter = createEvent<number>();
$character.on(moneyRemovedFromCharacter, (_, amount) => ({
  ..._,
  money: _.money - amount,
}));

export const $characterCurrentXp = $character.map((character) => {
  const currentGuild = character.guild;
  const currentXp = character.guilds.find(
    (gm) => gm.guild === currentGuild,
  )?.xp;
  return currentXp || 0;
});
export const $characterXpToNextLevel = $character.map((character) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  const currentXp = currentGuild?.xp || 0;
  const currentGuildLevel = currentGuild?.level || 1;
  const xpToNextLevel =
    GuildXpRequirements[currentGuildId][currentGuildLevel - 1];
  return xpToNextLevel - currentXp;
});
export const xpGainedByCharacter = createEvent<number>();
$character.on(xpGainedByCharacter, (character, xpGained) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  if (!currentGuild) {
    throw Error("Current guild information not found on character!");
  }
  const currentXp = currentGuild.xp;
  const currentGuildLevel = currentGuild.level;
  const xpToNextLevel =
    GuildXpRequirements[currentGuildId][currentGuildLevel - 1];
  const newXpValue = Math.min(xpToNextLevel, currentXp + xpGained);
  currentGuild.xp = newXpValue;
  const guildIndex = findCharacterGuildIndex(currentGuildId, character);
  const guilds = [...character.guilds];
  guilds[guildIndex] = currentGuild;
  return {
    ...character,
    guilds,
  };
});

export const $characterInventory = $character.map(
  (character) => character.items,
);

export const characterBoughtAnItem = createEvent<{
  item: TGameItem;
  price: number;
}>();
$character.on(characterBoughtAnItem, (state, transaction) => {
  const { item, price } = transaction;
  return {
    ...state,
    // reduce amount of money
    money: state.money - price,
    // add item to inventory
    items: [...state.items, item],
  };
});

export const characterSoldAnItem = createEvent<{
  item: TGameItem;
  price: number;
}>();
$character.on(characterSoldAnItem, (state, transaction) => {
  const { item, price } = transaction;
  const itemIndex = state.items.findIndex(itemsAreEqual(item));
  if (itemIndex < 0) {
    throw new Error("Item to sold not found in inventory!");
  }
  const udpatedInventory = [...state.items];
  udpatedInventory.splice(itemIndex, 1);
  return {
    ...state,
    money: state.money + price,
    items: udpatedInventory,
  };
});

export const characterEquippedAnItem = createEvent<TGameItem>();
$character.on(characterEquippedAnItem, (state, item) => {
  const itemIndex = state.items.findIndex(itemsAreEqual(item));
  if (itemIndex < 0) {
    throw new Error("Item to equip not found in inventory!");
  }
  if (item.kind !== "equipable") {
    throw new Error("Item is not equippable!");
  }
  const udpatedInventory = [...state.items];
  udpatedInventory.splice(itemIndex, 1, { ...item, isEquipped: true });
  return {
    ...state,
    items: udpatedInventory,
  };
});

export const characterUnequippedAnItem = createEvent<TGameItem>();
$character.on(characterUnequippedAnItem, (state, item) => {
  const itemIndex = state.items.findIndex(itemsAreEqual(item));
  if (itemIndex < 0) {
    throw new Error("Item to unequip not found in inventory!");
  }
  if (item.kind !== "equipable" || !item.isEquipped) {
    // cursed status can be also handled here
    throw new Error("Item can not be unequipped!");
  }
  const udpatedInventory = [...state.items];
  udpatedInventory.splice(itemIndex, 1, { ...item, isEquipped: false });
  return {
    ...state,
    items: udpatedInventory,
  };
});

export const characterDroppedAnItem = createEvent<TGameItem>();
$character.on(characterDroppedAnItem, (state, item) => {
  const itemIndex = state.items.findIndex(itemsAreEqual(item));
  if (itemIndex < 0) {
    throw new Error("Item to drop not found in inventory!");
  }
  const udpatedInventory = [...state.items];
  udpatedInventory.splice(itemIndex, 1);
  return {
    ...state,
    items: udpatedInventory,
  };
});
