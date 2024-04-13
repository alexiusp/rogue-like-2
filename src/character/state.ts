import {
  combine,
  createDomain,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { EAlignment } from "../common/alignment";
import {
  getCurrentSlot,
  loadCharacterData,
  saveCharacterData,
  setSlotName,
} from "../common/db";
import { createDelayEffect } from "../common/delay";
import { rollDiceCheck } from "../common/random";
import { TStatsValues, getStatBonus } from "../common/stats";
import {
  GuildSpecs,
  generateHpForGuildLevel,
  getGuildXpRequirementsForLevel,
} from "../guilds/models";
import { EGuild, IGuildMembership } from "../guilds/types";
import GlobalItemsCatalogue from "../items/GlobalItemsCatalogue";
import {
  IUsableGameItem,
  IdLevel,
  TGameItem,
  getItemsStatsBonuses,
  isBaseItemUsable,
  isItemEquipable,
  isItemUsable,
  itemCanBeUsed,
} from "../items/models";
import { IGameSpell } from "../magic/types";
import { messageAdded } from "../messages/state";
import { forward } from "../navigation";
import {
  createNewCharacter,
  findCharacterGuildIndex,
  getCharacterGuild,
} from "./models";
import {
  ECharacterRace,
  RaceAgeMap,
  RaceFreePointsMap,
  RaceStatsMap,
} from "./races";
import {
  EGender,
  IBaseCharacterInfo,
  ICharacterState,
  TCharacterCombinedState,
  TCharacterInventory,
} from "./types";

const baseInfoDefault: IBaseCharacterInfo = {
  name: "PlayerName",
  picture: "01.png",
  gender: EGender.Other,
};

const baseStatsDefault: TStatsValues = {
  strength: RaceStatsMap.strength[ECharacterRace.Human][0] + 5,
  endurance: RaceStatsMap.endurance[ECharacterRace.Human][0] + 5,
  dexterity: RaceStatsMap.dexterity[ECharacterRace.Human][0] + 5,
  wisdom: RaceStatsMap.wisdom[ECharacterRace.Human][0] + 5,
  intelligence: RaceStatsMap.intelligence[ECharacterRace.Human][0] + 5,
  charisma: RaceStatsMap.charisma[ECharacterRace.Human][0] + 5,
};

const fallbackState: ICharacterState = {
  alignment: EAlignment.Good,
  race: ECharacterRace.Human,
  age: 0,
  guild: EGuild.Adventurer,
  guilds: [{ guild: EGuild.Adventurer, level: 1, xp: 0 }],
  hp: 0,
  hpMax: 0,
  money: 0,
  mp: 0,
  mpMax: 0,
};

export const characterDomain = createDomain("character");
characterDomain.onCreateStore((store) => {
  const key = `${characterDomain.shortName}-${store.shortName}`;
  let value = null;
  if (getCurrentSlot()) {
    value = loadCharacterData(key);
  }
  if (value !== null) {
    store.setState(value);
  }
  store.watch((value) => {
    if (!getCurrentSlot()) {
      return;
    }
    saveCharacterData(key, value);
  });
});

export const $characterBaseInfo =
  characterDomain.createStore<IBaseCharacterInfo>(baseInfoDefault, {
    name: "base-info",
  });

export const $character = characterDomain.createStore<ICharacterState>(
  fallbackState,
  { name: "main" },
);

export const $characterStats = characterDomain.createStore<TStatsValues>(
  baseStatsDefault,
  { name: "stats" },
);

export const $characterRace = $character.map((character) => character.race);

export const avatarChanged = createEvent<string>();
$characterBaseInfo.on(avatarChanged, (_, picture) => ({ ..._, picture }));
export const $characterAvatar = $characterBaseInfo.map((c) => c.picture);

export const nameChanged = createEvent<string>();
$characterBaseInfo.on(nameChanged, (_, name) => ({ ..._, name }));

export const genderChanged = createEvent<EGender>();
$characterBaseInfo.on(genderChanged, (_, gender) => ({ ..._, gender }));

export const raceChanged = createEvent<ECharacterRace>();
$character.on(raceChanged, (character, race) => {
  // reset initial stats for given race
  const strength = RaceStatsMap.strength[race][0] + 5;
  const endurance = RaceStatsMap.endurance[race][0] + 5;
  const dexterity = RaceStatsMap.dexterity[race][0] + 5;
  const wisdom = RaceStatsMap.wisdom[race][0] + 5;
  const intelligence = RaceStatsMap.intelligence[race][0] + 5;
  const charisma = RaceStatsMap.charisma[race][0] + 5;
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

export const $characterAlignment = $character.map((c) => c.alignment);
export const alignmentChanged = createEvent<EAlignment>();
$character.on(alignmentChanged, (_, align) => ({ ..._, align }));

export const $freePoints = createStore<number>(
  RaceFreePointsMap[ECharacterRace.Human],
);
export const freePointsChanged = createEvent<number>();
// reset free points on race change
$freePoints.on(raceChanged, (_, race) => RaceFreePointsMap[race]);
$freePoints.on(freePointsChanged, (oldValue, newValue) => oldValue - newValue);

export const $characterStrength = $characterStats.map(
  (stats) => stats.strength,
);
export const strengthChanged = createEvent<number>();
$characterStats.on(strengthChanged, (_, value) => ({ ..._, strength: value }));

export const $characterEndurance = $characterStats.map(
  (stats) => stats.endurance,
);
export const enduranceChanged = createEvent<number>();
$characterStats.on(enduranceChanged, (_, value) => ({
  ..._,
  endurance: value,
}));

export const $characterDexterity = $characterStats.map(
  (stats) => stats.dexterity,
);
export const dexterityChanged = createEvent<number>();
$characterStats.on(dexterityChanged, (_, value) => ({
  ..._,
  dexterity: value,
}));

export const $characterWisdom = $characterStats.map((stats) => stats.wisdom);
export const wisdomChanged = createEvent<number>();
$characterStats.on(wisdomChanged, (_, value) => ({ ..._, wisdom: value }));

export const $characterIntelligence = $characterStats.map(
  (stats) => stats.intelligence,
);
export const intelligenceChanged = createEvent<number>();
$characterStats.on(intelligenceChanged, (_, value) => ({
  ..._,
  intelligence: value,
}));

export const $characterCharisma = $characterStats.map(
  (stats) => stats.charisma,
);
export const charismaChanged = createEvent<number>();
$characterStats.on(charismaChanged, (_, value) => ({ ..._, charisma: value }));

export const characterCreated = createEvent();
const setCharacterSaveSlotFx = createEffect<
  { base: IBaseCharacterInfo; char: ICharacterState; stats: TStatsValues },
  ICharacterState
>(({ base, char, stats }) => {
  const newState = createNewCharacter(char, base, stats);
  const saveSlotName = `${base.name} - ${EGender[base.gender]} ${ECharacterRace[char.race]} (${EGuild[char.guild]})`;
  setSlotName(saveSlotName);
  return newState;
});
sample({
  clock: characterCreated,
  source: {
    base: $characterBaseInfo,
    char: $character,
    stats: $characterStats,
  },
  target: setCharacterSaveSlotFx,
});
sample({
  clock: setCharacterSaveSlotFx.doneData,
  target: $character,
});

export const characterLoaded = createEvent();
$character.on(characterLoaded, (_) => {
  const c = loadCharacterData<ICharacterState>("character-main");
  if (!c) {
    return _;
  }
  return c;
});
$characterBaseInfo.on(characterLoaded, (_) => {
  const c = loadCharacterData<IBaseCharacterInfo>("character-base-info");
  if (!c) {
    return _;
  }
  return c;
});
$characterStats.on(characterLoaded, (_) => {
  const c = loadCharacterData<TStatsValues>("character-stats");
  if (!c) {
    return _;
  }
  return c;
});

export const $characterHealth = $character.map((character) => character.hp);
export const characterHpChanged = createEvent<number>();
$character.on(characterHpChanged, (character, hpChange) => {
  return {
    ...character,
    hp: character.hp + hpChange,
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
export const $characterGuild = $character.map((c) => c.guild);
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

export const $characterInventory =
  characterDomain.createStore<TCharacterInventory>([], { name: "inventory" });

$characterInventory.on(characterLoaded, (_) => {
  const i = loadCharacterData<TCharacterInventory>("character-inventory");
  if (!i) {
    return _;
  }
  return i;
});

export const $characterItemsStatsBonuses = $characterInventory.map((items) =>
  getItemsStatsBonuses(items),
);

export const characterBoughtAnItem = createEvent<{
  item: TGameItem;
  price: number;
}>();
$character.on(characterBoughtAnItem, (state, transaction) => {
  const { price } = transaction;
  return {
    ...state,
    // reduce amount of money
    money: state.money - price,
  };
});
$characterInventory.on(characterBoughtAnItem, (state, transaction) => {
  const { item } = transaction;
  return [...state, item];
});

export const characterSoldAnItem = createEvent<{
  itemIndex: number;
  price: number;
}>();
$character.on(characterSoldAnItem, (state, transaction) => {
  const { price } = transaction;
  return {
    ...state,
    money: state.money + price,
  };
});
$characterInventory.on(characterSoldAnItem, (state, transaction) => {
  const { itemIndex } = transaction;
  const udpatedInventory = [...state];
  udpatedInventory.splice(itemIndex, 1);
  return udpatedInventory;
});

export const characterEquippedAnItem = createEvent<number>();
$characterInventory.on(characterEquippedAnItem, (state, itemIndex) => {
  const item = state[itemIndex];
  if (!isItemEquipable(item)) {
    throw new Error("Item is not equippable!");
  }
  const udpatedInventory = [...state];
  udpatedInventory.splice(itemIndex, 1, { ...item, isEquipped: true });
  return udpatedInventory;
});

export const characterUnequippedAnItem = createEvent<number>();
$characterInventory.on(characterUnequippedAnItem, (state, itemIndex) => {
  const item = state[itemIndex];
  if (!isItemEquipable(item) || !item.isEquipped) {
    // cursed status can be also handled here
    throw new Error("Item can not be unequipped!");
  }
  const udpatedInventory = [...state];
  udpatedInventory.splice(itemIndex, 1, { ...item, isEquipped: false });
  return udpatedInventory;
});

export const characterDroppedAnItem = createEvent<number>();
$characterInventory.on(characterDroppedAnItem, (state, itemIndex) => {
  const udpatedInventory = [...state];
  udpatedInventory.splice(itemIndex, 1);
  return udpatedInventory;
});

export const characterReceivedItems = createEvent<TGameItem[]>();
$characterInventory.on(characterReceivedItems, (inventory, receivedItems) => {
  const udpatedInventory = [...inventory, ...receivedItems];
  return udpatedInventory;
});

type TItemId = {
  itemIndex: number;
  price: number;
};
export const characterIdentifiedAnItem = createEvent<TItemId>();
type TCharacterIdPayload = {
  character: ICharacterState;
  inventory: TCharacterInventory;
  action: TItemId;
};
const itemIdFx = createEffect<TCharacterIdPayload, TCharacterIdPayload>(
  ({ action, character, inventory }) => {
    const item = inventory[action.itemIndex];
    if (item.idLevel === 2) {
      throw Error("Item already identified!");
    }
    const newIdLevel: IdLevel = item.idLevel >= 1 ? 2 : 1;
    const updatedInventory = [...inventory];
    const identifiedItem: TGameItem = {
      ...item,
      idLevel: newIdLevel,
    };
    updatedInventory.splice(action.itemIndex, 1, identifiedItem);
    const updatedCharacter: ICharacterState = {
      ...character,
      money: character.money - action.price,
    };
    return { action, character: updatedCharacter, inventory: updatedInventory };
  },
);
sample({
  clock: characterIdentifiedAnItem,
  source: { character: $character, inventory: $characterInventory },
  target: itemIdFx,
  fn({ character, inventory }, action) {
    return { character, inventory, action };
  },
});
$character.on(itemIdFx.doneData, (_, { character }) => character);
$characterInventory.on(itemIdFx.doneData, (_, { inventory }) => inventory);

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
interface ICharacterResurrectionProps {
  character: ICharacterState;
  stats: TStatsValues;
  level: number;
}

function resurrectACharacter({
  character,
  stats,
  level,
}: ICharacterResurrectionProps): Promise<ICharacterResurrectionProps> {
  return new Promise((resolve) => {
    messageAdded("You were resurrected. You feel older.");
    const { age, race, money, guild, guilds, hpMax } = character;
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
      messageAdded(
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
    messageAdded(
      `Morgue workers took ${Math.min(money, cost)} gold for their services.`,
    );
    // character also looses all xp up to the current level starting point
    const guildIndex = findCharacterGuildIndex(guild, character);
    const currentGuild = guilds[guildIndex];
    const xpToLevel = getGuildXpRequirementsForLevel(
      guild,
      currentGuild.level - 1,
    );
    messageAdded(
      `Your experience for ${EGuild[guild]} guild is decreased to ${xpToLevel}.`,
    );
    const updatedGuild: IGuildMembership = {
      ...currentGuild,
      xp: xpToLevel,
    };
    const udpatedGuilds = [...guilds];
    udpatedGuilds.splice(guildIndex, 1, updatedGuild);
    const updatedCharacter: ICharacterState = {
      ...character,
      age: udpatedAge,
      money: updatedMoney,
      guilds: udpatedGuilds,
      hp: hpMax,
    };
    resolve({ character: updatedCharacter, stats: udpatedStats, level });
    return;
  });
}

const characterResurrectionFx = createEffect<
  ICharacterResurrectionProps,
  ICharacterResurrectionProps
>(resurrectACharacter);

sample({
  clock: characterResurrected,
  source: { character: $character, stats: $characterStats },
  target: characterResurrectionFx,
  fn: ({ character, stats }, clk) => ({ character, stats, level: clk }),
});
$character.on(
  characterResurrectionFx.doneData,
  (_, { character }) => character,
);
$characterStats.on(characterResurrectionFx.doneData, (_, { stats }) => stats);
// resurrection process implemented as effect to separate character state update, saving and redirect to city
const characterResurrectionDelayFx = createEffect(createDelayEffect(100));

sample({
  clock: characterResurrectionFx.finally,
  target: characterResurrectionDelayFx,
});

// trigger redirect to city after saving
sample({
  clock: characterResurrectionDelayFx.finally,
  target: forward,
  fn: () => "city",
});

export const characterUsesAnItem = createEvent<number>();
characterUsesAnItem.watch((index) =>
  console.log("character uses item #", index, "from list"),
);

export const characterUsesAnItemFx = createEffect<
  IUsableGameItem,
  IGameSpell,
  string
>(
  (item) =>
    new Promise((resolve, reject) => {
      console.log("characterUsesAnItemFx.start", item);
      const baseItem = GlobalItemsCatalogue[item.item];
      if (!isBaseItemUsable(baseItem)) {
        reject("Item is unusable!");
        return;
      }
      const spell = baseItem.spell;
      console.log("characterUsesAnItemFx.end", spell);
      resolve(spell);
      return;
    }),
);

// get item and send it to effect to create a spell
sample({
  clock: characterUsesAnItem,
  source: { character: $character, items: $characterInventory },
  target: characterUsesAnItemFx,
  fn({ items }, itemIndex) {
    const item = items[itemIndex];
    if (!isItemUsable(item) || !itemCanBeUsed(item)) {
      throw new Error("unusable item");
    }
    return item;
  },
});

// reduce item uses
sample({
  clock: characterUsesAnItem,
  source: $characterInventory,
  target: $characterInventory,
  fn(inventory, itemIndex) {
    const item = inventory[itemIndex];
    if (!isItemUsable(item) || !itemCanBeUsed(item)) {
      throw new Error("unusable item");
    }
    const updatedItem: IUsableGameItem = {
      ...item,
      usesLeft: item.usesLeft - 1,
    };
    const updatedItems = [...inventory];
    updatedItems[itemIndex] = updatedItem;
    return updatedItems;
  },
});

export const $characterState = combine(
  $characterBaseInfo,
  $character,
  $characterStats,
  $characterInventory,
  (base, ch, stats, inv) => {
    const combinedState: TCharacterCombinedState = {
      ...base,
      ...ch,
      stats,
      items: inv,
    };
    return combinedState;
  },
);
