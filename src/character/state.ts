import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { EAlignment } from "../common/alignment";
import {
  loadCharacterData,
  saveCharacterData,
  setSlotName,
} from "../common/db";
import { createDelayEffect } from "../common/delay";
import { rollDiceCheck } from "../common/random";
import { getStatBonus } from "../common/stats";
import {
  GuildSpecs,
  generateHpForGuildLevel,
  getGuildXpRequirementsForLevel,
} from "../guilds/models";
import { EGuild, IGuildMembership } from "../guilds/types";
import { IdLevel, TGameItem, itemsAreSame } from "../items/models";
import { forward } from "../navigation";
import {
  EGender,
  ICharacterState,
  createNewCharacter,
  findCharacterGuildIndex,
  getCharacterGuild,
  rerollStat,
} from "./models";
import { ECharacterRace, RaceAgeMap } from "./races";

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
  const cachedData = loadCharacterData<ICharacterState>("character");
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

export const $characterStats = $character.map((c) => c.stats);

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
  saveCharacterData("character", newState);
  return newState;
});
export const characterSaved = createEvent();
$character.on(characterSaved, (state) => {
  const saveSlotName = `${state.name} - ${EGender[state.gender]} ${ECharacterRace[state.race]} (${EGuild[state.guild]})`;
  setSlotName(saveSlotName);
  saveCharacterData("character", state);
  return state;
});
export const characterLoaded = createEvent();
$character.on(characterLoaded, (state) => {
  const character = loadCharacterData<ICharacterState>("character");
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

export const $characterIsDead = $characterHealth.map((hp) => hp <= 0);

export const $characterMana = $character.map((character) => character.mp);
export const characterMpChanged = createEvent<number>();
$character.on(characterMpChanged, (character, mp) => {
  return {
    ...character,
    mp,
  };
});

export const $characterMaxHp = $character.map((character) => character.hpMax);

export const $characterMaxMana = $character.map((character) => character.mpMax);

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
  const xpToNextLevel = getGuildXpRequirementsForLevel(
    currentGuildId,
    currentGuildLevel,
  );
  return Math.max(xpToNextLevel - currentXp, 0);
});
export const $characterMaxXpForCurrentGuild = $character.map((character) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  const currentGuildLevel = currentGuild?.level || 1;
  return getGuildXpRequirementsForLevel(currentGuildId, currentGuildLevel);
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
  // limit xp gain by current guild level + 1
  const xpToNextLevel = getGuildXpRequirementsForLevel(
    currentGuildId,
    currentGuildLevel + 1,
  );
  // "pinned" state - xp to second level - 1
  const newXpValue = Math.min(xpToNextLevel - 1, currentXp + xpGained);
  currentGuild.xp = newXpValue;
  const guildIndex = findCharacterGuildIndex(currentGuildId, character);
  const guilds = [...character.guilds];
  guilds[guildIndex] = currentGuild;
  return {
    ...character,
    guilds,
  };
});
export const $characterPinned = $character.map((character) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  if (!currentGuild) {
    throw Error("Current guild information not found on character!");
  }
  const currentXp = currentGuild.xp;
  const currentGuildLevel = currentGuild.level;
  const xpToPin =
    getGuildXpRequirementsForLevel(currentGuildId, currentGuildLevel + 1) - 1;
  return currentXp === xpToPin;
});
export const $characterReadyToLevelUp = $character.map((character) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  if (!currentGuild) {
    throw Error("Current guild information not found on character!");
  }
  const currentXp = currentGuild.xp;
  const currentGuildLevel = currentGuild.level;
  const xpToLevel = getGuildXpRequirementsForLevel(
    currentGuildId,
    currentGuildLevel,
  );
  return currentXp >= xpToLevel;
});
export const $guildLevelMoneyCost = $character.map((character) => {
  const currentGuildId = character.guild;
  const GuildSpec = GuildSpecs[currentGuildId];
  const currentGuild = getCharacterGuild(currentGuildId, character);
  if (!currentGuild) {
    throw Error("Current guild information not found on character!");
  }
  const currentGuildLevel = currentGuild.level;
  const guildsAmount = character.guilds.length;
  return Math.pow(
    100 * (GuildSpec.xpRatio / 8) * currentGuildLevel,
    guildsAmount,
  );
});
export const $canAffordLevelUp = combine(
  $guildLevelMoneyCost,
  $characterMoney,
  (cost, money) => cost <= money,
);
export const $characterGuildQuest = $character.map((character) => {
  const currentGuildId = character.guild;
  const currentGuild = getCharacterGuild(currentGuildId, character);
  if (!currentGuild) {
    throw Error("Current guild information not found on character!");
  }
  return currentGuild.quest ?? null;
});
export const $characterCurrentGuild = $character.map((c) => c.guild);
export const $characterGuilds = $character.map((c) => c.guilds);

export const characterJoinedGuild = createEvent<EGuild>();
$character.on(characterJoinedGuild, (state, guild) => {
  const guildIndex = findCharacterGuildIndex(guild, state);
  if (guildIndex >= 0) {
    // if guild exist - reacquaint
    return {
      ...state,
      guild,
    };
  }
  // otherwise create new guild membership
  const newGuildMembership: IGuildMembership = {
    guild,
    level: 1,
    xp: 0,
  };
  // and add it to the guilds list
  const updatedGuilds = [...state.guilds, newGuildMembership];
  return {
    ...state,
    // set current guild to the new guild
    guild,
    // update guild membership list
    guilds: updatedGuilds,
  };
});

export const characterLevelsUp = createEvent();
$character.on(characterLevelsUp, (character) => {
  const currentGuildId = character.guild;
  const guildIndex = findCharacterGuildIndex(currentGuildId, character);
  if (guildIndex < 0) {
    throw Error("Current guild information not found on character!");
  }
  const GuildSpec = GuildSpecs[currentGuildId];
  // update guild info
  const currentGuild = character.guilds[guildIndex];
  const currentGuildLevel = currentGuild.level;
  const updatedGuild: IGuildMembership = {
    ...currentGuild,
    level: currentGuildLevel + 1,
  };
  const udpatedGuilds = [...character.guilds];
  udpatedGuilds.splice(guildIndex, 1, updatedGuild);
  // calculate payment
  const guildsAmount = udpatedGuilds.length;
  const price = Math.pow(
    100 * (GuildSpec.xpRatio / 8) * currentGuildLevel,
    guildsAmount,
  );
  // calculate update to hp/mp
  const hpBoost = generateHpForGuildLevel(
    currentGuildId,
    currentGuildLevel + 1,
  );
  console.log("hpBoost for level:", hpBoost);
  const hpMax = character.hpMax + hpBoost;
  const hp = hpMax;
  return {
    ...character,
    guilds: udpatedGuilds,
    money: character.money - price,
    hp,
    hpMax,
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
  const itemIndex = state.items.findIndex(itemsAreSame(item));
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
  const itemIndex = state.items.findIndex(itemsAreSame(item));
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
  const itemIndex = state.items.findIndex(itemsAreSame(item));
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
  const itemIndex = state.items.findIndex(itemsAreSame(item));
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

export const characterReceivedItems = createEvent<TGameItem[]>();
$character.on(characterReceivedItems, (character, receivedItems) => {
  const udpatedInventory = [...character.items, ...receivedItems];
  return {
    ...character,
    items: udpatedInventory,
  };
});

export const characterIdentifiedAnItem = createEvent<{
  item: TGameItem;
  price: number;
}>();
$character.on(characterIdentifiedAnItem, (character, { item, price }) => {
  if (item.idLevel === 2) {
    return character;
  }
  const newIdLevel: IdLevel = item.idLevel >= 1 ? 2 : 1;
  const itemIndex = character.items.findIndex(itemsAreSame(item));
  if (itemIndex < 0) {
    throw new Error("Item to identify not found in inventory!");
  }
  const udpatedInventory = [...character.items];
  const identifiedItem: TGameItem = {
    ...item,
    idLevel: newIdLevel,
  };
  udpatedInventory.splice(itemIndex, 1, identifiedItem);
  return {
    ...character,
    items: udpatedInventory,
    money: character.money - price,
  };
});

export const characterEatBread = createEvent();
$character.on(characterEatBread, (character) => {
  const money = character.money - 10;
  if (money < 0) {
    throw Error("Not enough money");
  }
  const hp = Math.min(character.hp + 10, character.hpMax);
  return {
    ...character,
    money,
    hp,
  };
});

export const characterEatLunch = createEvent();
$character.on(characterEatLunch, (character) => {
  const money = character.money - 100;
  if (money < 0) {
    throw Error("Not enough money");
  }
  const hp = Math.min(character.hp + 100, character.hpMax);
  return {
    ...character,
    money,
    hp,
  };
});

export const characterDrinkBeer = createEvent();
$character.on(characterDrinkBeer, (character) => {
  const money = character.money - 20;
  if (money < 0) {
    throw Error("Not enough money");
  }
  const mp = Math.min(character.mp + 10, character.mpMax);
  return {
    ...character,
    money,
    mp,
  };
});

export const characterDrinkWine = createEvent();
$character.on(characterDrinkWine, (character) => {
  const money = character.money - 200;
  if (money < 0) {
    throw Error("Not enough money");
  }
  const mp = Math.min(character.mp + 100, character.mpMax);
  return {
    ...character,
    money,
    mp,
  };
});

// input argument - dungeon level
export const characterResurrected = createEvent<number>();

$character.on(characterResurrected, (character, level) => {
  console.log("You were resurrected. You feel older.");
  const { age, race, stats, money, guild, guilds, hpMax } = character;
  const maxAge = RaceAgeMap[race][1];
  const ageBonus = (maxAge - 2 * age) / maxAge;
  const statBonus = getStatBonus(stats.endurance);
  const diceCheckValue = Math.round(15 + statBonus + ageBonus);
  const gotComplications = rollDiceCheck(diceCheckValue, "1D20");
  // if complications occur - character will lose one point of endurance
  const udpatedStats = {
    ...stats,
  };
  // ageing - one moth per level of the dungeon
  let udpatedAge = age + level / 12;
  if (gotComplications) {
    console.log(
      "There were complications! You lost one point of endurance and aged even more than usually.",
    );
    // current complications are only endurance and age
    udpatedStats.endurance -= 1;
    udpatedAge += level / 12;
    // consider to drain more stats if character is old
  }
  // character loses money up to a particular sum
  // this is why its good to store them in the bank ;)
  const cost = Math.pow(100, level);
  const updatedMoney = Math.max(0, money - cost);
  console.log(
    `Morgue workers took ${Math.min(money, cost)} gold for their services.`,
  );
  // character also looses all xp up to the current level starting point
  const guildIndex = findCharacterGuildIndex(guild, character);
  const currentGuild = guilds[guildIndex];
  const xpToLevel = getGuildXpRequirementsForLevel(
    guild,
    currentGuild.level - 1,
  );
  console.log(
    `Your experience for ${EGuild[guild]} guild is decreased to ${xpToLevel}.`,
  );
  const updatedGuild: IGuildMembership = {
    ...currentGuild,
    xp: xpToLevel,
  };
  const udpatedGuilds = [...guilds];
  udpatedGuilds.splice(guildIndex, 1, updatedGuild);
  return {
    ...character,
    age: udpatedAge,
    stats: udpatedStats,
    money: updatedMoney,
    guilds: udpatedGuilds,
    hp: hpMax,
  };
});

// resurrection process implemented as effect to separate character state update, saving and redirect to city
const characterResurrectionFx = createEffect(createDelayEffect(100));

sample({
  clock: characterResurrected,
  target: characterResurrectionFx,
});

// start saving after updating the state
sample({ clock: characterResurrectionFx.done, target: characterSaved });
// trigger redirect to city after saving
sample({
  clock: characterResurrectionFx.finally,
  target: forward,
  fn: () => "city",
});
