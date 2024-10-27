export const getRandomInt = (max = 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export type TRandomBagValue<T> = T | null;

export type TRandomBag<T> = Array<TRandomBagValue<T>>;

export function getNullBag(amount: number): Array<null> {
  return new Array(amount).fill(null);
}

export function padWithNulls<T>(items: T[], amount: number): TRandomBag<T> {
  const presentLength = items.length;
  const restNulls = getNullBag(amount - presentLength);
  return [...items, ...restNulls];
}

export function getNumberBag(amount: number, filler: number): Array<number> {
  return new Array(amount).fill(filler);
}

export class RandomBag<T> {
  private items: Array<T>;

  constructor(initialItems: Array<T> = []) {
    this.items = initialItems;
  }

  public addItem(item: T) {
    this.items.push(item);
  }

  public addItems(item: T, amount: number) {
    for (let index = 0; index < amount; index++) {
      this.items.push(item);
    }
  }

  public getRandomItem() {
    if (this.items.length < 1) {
      throw Error("Random bag is empty!");
    }
    const index = getRandomInt(this.items.length - 1);
    return this.items[index];
  }
}

export function getOneFromRandomBag<T>(initialItems: Array<T>): T {
  const bag = new RandomBag(initialItems);
  return bag.getRandomItem();
}

type TDiceSides = 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 20 | 100;
type TDiceAmount = number;
type TDiceBonus = number;

export type TDiceStringWithoutBonus = `${TDiceAmount}D${TDiceSides}`;
export type TDiceStringWithBonus = `${TDiceStringWithoutBonus}+${TDiceBonus}`;
export type TDiceString = TDiceStringWithoutBonus | TDiceStringWithBonus;

export function rollDice(dice: TDiceSides) {
  return getRandomInt(dice, 1);
}

const DiceRegexp = /(?<amount>\d*)D(?<dice>\d*)(?:\+(?<bonus>\d+))?/gi;

type TDiceObject = {
  amount: TDiceAmount;
  sides: TDiceSides;
  bonus: TDiceBonus;
};

function convertDiceToObject(dice: TDiceString): TDiceObject {
  const parts = DiceRegexp.exec(dice);
  if (parts === null) {
    throw Error("wrong dice pattern!");
  }
  const groups = parts.groups ?? {};
  const amount = Number(groups["amount"] ?? "1");
  const sides = Number(groups["dice"] ?? "6") as TDiceSides;
  const bonus = Number(groups["bonus"] ?? "0");
  return {
    amount,
    sides,
    bonus,
  };
}

export function rollDices(diceToRoll: TDiceString) {
  const diceObj = convertDiceToObject(diceToRoll);
  let result = diceObj.bonus;
  for (let index = 0; index < diceObj.amount; index++) {
    const roll = rollDice(diceObj.sides);
    result += roll;
  }
  return result;
}

// return maximum possible value from dice roll
// to calculate possible "crit" value
function getCritDiceRoll(diceToRoll: TDiceString) {
  const diceObj = convertDiceToObject(diceToRoll);
  return diceObj.amount * diceObj.sides + diceObj.bonus;
}

/**
 * roll given dice(s) and compare with threshold value
 * the lower the value is the easier it to pass the check
 * roll result must be greater than given value
 * Example: value = 17 and we roll 1D20 and get 18
 * function result - true
 * @param value threshold value
 * @param dice dice roll we need to roll
 * @returns true if dice rolled value is greater then given value
 */
export function rollDiceCheck(value: number, dice: TDiceString) {
  const roll = rollDices(dice);
  const result = roll > value || roll === getCritDiceRoll(dice);
  return result;
}
