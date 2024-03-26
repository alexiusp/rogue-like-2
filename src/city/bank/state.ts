import { StoreValue, createDomain } from "effector";
import { loadCharacterData, saveCharacterData } from "../../common/db";
import { TGameItem } from "../../items/models";

const bankDomain = createDomain("bank");

bankDomain.onCreateStore((store) => {
  const key = `${bankDomain.shortName}-${store.shortName}`;
  const value = loadCharacterData<StoreValue<typeof store>>(key);
  if (value !== null) {
    store.setState(value);
  }
});
bankDomain.onCreateStore((store) => {
  const key = `${bankDomain.shortName}-${store.shortName}`;
  store.watch((value) => {
    saveCharacterData(key, value);
  });
});

export const $bankMoney = bankDomain.createStore<number>(0, { name: "money" });

export const depositMoney = bankDomain.createEvent<number>();
$bankMoney.on(depositMoney, (account, money) => account + money);

export const withdrawMoney = bankDomain.createEvent<number>();
$bankMoney.on(withdrawMoney, (account, money) => account - money);

export const $bankStash = bankDomain.createStore<TGameItem[]>([], {
  name: "items",
});

// we can implement extending the stash for a price later
const DEFAULT_BANK_STASH_LIMIT = 40;
export const $bankStashFreeSlots = $bankStash.map(
  (items) => DEFAULT_BANK_STASH_LIMIT - items.length,
);
export const $bankStashLimitReached = $bankStashFreeSlots.map(
  (slots) => slots >= DEFAULT_BANK_STASH_LIMIT,
);

export const itemDeposited = bankDomain.createEvent<TGameItem>();
$bankStash.on(itemDeposited, (stash, item) => [...stash, item]);

export const itemWithdrawn = bankDomain.createEvent<number>();
$bankStash.on(itemWithdrawn, (stash, itemIndex) => {
  const newStash = [...stash];
  newStash.splice(itemIndex, 1);
  return newStash;
});
