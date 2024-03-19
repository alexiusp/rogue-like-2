import StoreIcon from "@mui/icons-material/Store";
import { IconButton, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import bg from "../assets/guilds-street.jpg";
import { $characterCurrentGuild } from "../character/state";
import Screen from "../layout/Screen";
import { back } from "../navigation";
import { EGuild } from "./types";

export default function GuildsScreen() {
  const currentGuild = useUnit($characterCurrentGuild);
  return (
    <Screen
      header={
        <>
          <IconButton onClick={() => back()} size="small">
            <StoreIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Guilds
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Typography variant="h4" component="h2">
        Welcome to the {EGuild[currentGuild]}&apos;s guild.
      </Typography>
    </Screen>
  );
}
