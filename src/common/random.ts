export const getRandomInt = (max = 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function getNullBag(amount: number): Array<null> {
  return new Array(amount).fill(null);
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

type TDiceSides = 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 20;
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

export function rollDiceCheck(value: number, dice: TDiceString) {
  const roll = rollDices(dice);
  console.log("rollDiceCheck", value, roll);
  return value > roll;
}
