import { createStore } from "effector";
import { loadSharedData } from "../common/db";
import { getInitialGuildMasters } from "./models";
import { IGuildMaster } from "./types";

const startState = (() => {
  const cachedData = loadSharedData<IGuildMaster[]>("guild-masters");
  return cachedData !== null ? cachedData : getInitialGuildMasters();
})();

export const $guildMasters = createStore<IGuildMaster[]>(startState);
