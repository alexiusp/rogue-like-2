import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import { $characterGuilds } from "../character/state";
import { FullGuildsList } from "./models";
import { guildVisited } from "./state";
import { EGuild } from "./types";

export default function GuildsList() {
  const [selected, selectGuild] = useState<EGuild>();
  const toggleSelected = (guild: EGuild) => () => {
    if (guild === selected) {
      selectGuild(undefined);
      return;
    }
    selectGuild(guild);
  };
  const characterGuilds = useUnit($characterGuilds);
  function getGuildLevel(guild: EGuild) {
    const guildMembership = characterGuilds.find(
      (membership) => membership.guild === guild,
    );
    return guildMembership ? guildMembership.level : 0;
  }
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" component="h4">
        Guilds
      </Typography>
      <List
        sx={{
          p: 0,
          border: "1px solid",
          borderColor: "divider",
          width: "100%",
        }}
      >
        {FullGuildsList.map((guild) => {
          const level = getGuildLevel(guild);
          const levelSuffix = level > 0 ? `(${level})` : "";
          const label = `${EGuild[guild]} ${levelSuffix}`;
          return (
            <ListItem disablePadding key={`guild-${guild}`} divider={true}>
              <ListItemButton
                selected={selected === guild}
                onClick={toggleSelected(guild)}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Button
        disabled={typeof selected === "undefined"}
        variant="outlined"
        onClick={() => guildVisited(selected!)}
      >
        Visit
      </Button>
    </Stack>
  );
}
