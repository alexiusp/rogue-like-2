import { createEvent, createStore } from "effector";
import { loadCharacterData, saveCharacterData } from "../../common/db";

const fallbackMoneyState = 0;
const startState = (() => {
  const cachedData = loadCharacterData<number>("bank-money");
  return cachedData !== null ? cachedData : fallbackMoneyState;
})();

export const $bankMoney = createStore<number>(startState);

export const bankStateSaved = createEvent();
$bankMoney.on(bankStateSaved, (state) => {
  saveCharacterData("bank-money", state);
  return state;
});
export const bankStateLoaded = createEvent();
$bankMoney.on(bankStateLoaded, (state) => {
  const bankState = loadCharacterData<number>("bank-money");
  if (!bankState) {
    return state;
  }
  return bankState;
});

export const depositMoney = createEvent<number>();
$bankMoney.on(depositMoney, (account, money) => account + money);

export const withdrawMoney = createEvent<number>();
$bankMoney.on(withdrawMoney, (account, money) => account - money);

// TODO: implement items storage
