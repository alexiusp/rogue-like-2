import { combine, createEvent, createStore } from "effector";
import { loadSharedData, saveSharedData } from "../common/db";
import { getInitialGuildMasters } from "./models";
import { EGuild, IGuildMaster } from "./types";

const startState = (() => {
  const cachedData = loadSharedData<IGuildMaster[]>("guild-masters");
  return cachedData !== null ? cachedData : getInitialGuildMasters();
})();

export const $guildMasters = createStore<IGuildMaster[]>(startState);

export const guildInfoLoaded = createEvent();
$guildMasters.on(guildInfoLoaded, (state) => {
  const cachedData = loadSharedData<IGuildMaster[]>("guild-masters");
  if (!cachedData) {
    return state;
  }
  return cachedData;
});
export const guildInfoSaved = createEvent();
$guildMasters.on(guildInfoSaved, (state) => {
  saveSharedData("guild-masters", state);
  return state;
});

export const $guildCursor = createStore(EGuild.Adventurer);

export const $currentGuildMaster = combine(
  $guildMasters,
  $guildCursor,
  (masters, guild) => {
    const guildMaster = masters.find((m) => m.guild === guild);
    if (!guildMaster) {
      throw Error(`Guild master not found for guild ${EGuild[guild]}`);
    }
    return `${guildMaster.name} (Level ${guildMaster.level})`;
  },
);

export const guildVisited = createEvent<EGuild>();
$guildCursor.on(guildVisited, (_, guild) => guild);
