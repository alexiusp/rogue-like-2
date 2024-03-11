export const getRandomInt = (max = 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export class RandomBag<T> {
  private items: T[];

  constructor(initialItems: T[] = []) {
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
    const index = getRandomInt(this.items.length - 1);
    return this.items[index];
  }
}
