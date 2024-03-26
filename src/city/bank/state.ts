import { StoreValue, createDomain } from "effector";
import { loadCharacterData, saveCharacterData } from "../../common/db";

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
