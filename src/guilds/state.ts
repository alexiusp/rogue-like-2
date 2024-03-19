import { createStore } from "effector";
import { getInitialGuildMasters } from "./models";
import { IGuildMaster } from "./types";

export const $guildMasters = createStore<IGuildMaster[]>(
  getInitialGuildMasters(),
);
