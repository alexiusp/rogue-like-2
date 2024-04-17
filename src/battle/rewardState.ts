import { createEffect, createEvent, createStore, sample } from "effector";
import { $characterState } from "../character/state";
import { TCharacterCombinedState } from "../character/types";
import { TGameItem, itemsAreSame } from "../items/models";
import { messageAdded } from "../messages/state";
import {
  IGameMonster,
  generateMonstersItemsReward,
  generateMonstersMoneyReward,
  generateMonstersXpReward,
} from "../monsters/model";
import { $monsters, battleEnded } from "./state";
import { IEncounterReward } from "./types";

export const $encounterMoneyReward = createStore(0);
export const $encounterItemsReward = createStore<TGameItem[]>([]);
export const $encounterXpReward = createStore(0);

//const encounterEndedWithReward = createEvent<IEncounterReward>();
const rewardCalculationFx = createEffect<
  { character: TCharacterCombinedState; monsters: IGameMonster[] },
  IEncounterReward
>(({ character, monsters }) => {
  const money = generateMonstersMoneyReward(monsters);
  const xp = generateMonstersXpReward(monsters);
  const items = generateMonstersItemsReward(monsters, character);
  const pluralSuffix = items.length > 1 ? "s" : "";
  messageAdded(
    `You've got ${money} gold, ${xp} experience and ${items.length} item${pluralSuffix} as a reward for this victory!`,
  );
  const reward: IEncounterReward = {
    money,
    xp,
    items,
  };
  return reward;
});

sample({
  clock: battleEnded,
  source: { character: $characterState, monsters: $monsters },
  target: rewardCalculationFx,
  fn({ character, monsters }) {
    if (!monsters) {
      throw new Error("invalid monsters state");
    }
    return { character, monsters };
  },
});

$encounterMoneyReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.money,
);
$encounterItemsReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.items,
);
$encounterXpReward.on(rewardCalculationFx.doneData, (_, reward) => reward.xp);

export const itemDropped = createEvent<TGameItem>();
$encounterItemsReward.on(itemDropped, (items, item) => {
  const index = items.findIndex(itemsAreSame(item));
  if (index < 0) {
    throw new Error("Item to drop not found in the loot!");
  }
  const udpatedItems = [...items];
  udpatedItems.splice(index, 1);
  return udpatedItems;
});
