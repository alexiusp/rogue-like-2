import { createEvent, createStore } from "effector";
import { loadData, saveData } from "../../common/db";

const fallbackMoneyState = 0;
const startState = (() => {
  const cachedData = loadData<number>("bank-money");
  return cachedData !== null ? cachedData : fallbackMoneyState;
})();

export const $bankMoney = createStore<number>(startState);

export const bankStateSaved = createEvent();
$bankMoney.on(bankStateSaved, (state) => {
  saveData("bank-money", state);
  return state;
});
export const bankStateLoaded = createEvent();
$bankMoney.on(bankStateLoaded, (state) => {
  const bankState = loadData<number>("bank-money");
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
