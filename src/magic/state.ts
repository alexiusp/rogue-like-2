import { $characterGuilds } from "../character/state";
import { getAllSpellsFromGuilds } from "../guilds/models";

export const $characterSpells = $characterGuilds.map((guilds) =>
  getAllSpellsFromGuilds(guilds),
);
