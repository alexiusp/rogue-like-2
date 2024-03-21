export const getRandomInt = (max = 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export type TRandomBag<T> = Array<T | null>;

export function getNullBag(amount: number): Array<null> {
  return new Array(amount).fill(null);
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

type TDiceSides = 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 20 | 100;
type TDiceAmount = number;
type TDiceBonus = number;

export type TDiceStringWithoutBonus = `${TDiceAmount}D${TDiceSides}`;
export type TDiceStringWithBonus = `${TDiceStringWithoutBonus}+${TDiceBonus}`;
export type TDiceString = TDiceStringWithoutBonus | TDiceStringWithBonus;

export function rollDice(dice: TDiceSides) {
  return getRandomInt(dice, 1);
}

export function rollDices(diceToRoll: TDiceString) {
  const parts = /(?<amount>\d*)D(?<dice>\d*)(?:\+(?<bonus>\d+))?/gi.exec(
    diceToRoll,
  );
  if (parts === null) {
    throw Error("wrong dice pattern!");
  }
  const groups = parts.groups ?? {};
  const amount = Number(groups["amount"] ?? "1");
  const sides = Number(groups["dice"] ?? "6") as TDiceSides;
  const bonus = Number(groups["bonus"] ?? "0");
  let result = bonus;
  for (let index = 0; index < amount; index++) {
    const roll = rollDice(sides);
    result += roll;
  }
  return result;
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
  const result = roll > value;
  console.log("rollDiceCheck", result);
  return result;
}
