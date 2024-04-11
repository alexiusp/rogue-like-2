import StoreIcon from "@mui/icons-material/Store";
import {
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../assets/guilds-street.webp";
import {
  $canAffordLevelUp,
  $characterGuild,
  $characterGuilds,
  $characterReadyToLevelUp,
  $characterStats,
  $guildLevelMoneyCost,
  characterJoinedGuild,
  characterLevelsUp,
} from "../character/state";
import CityStatusBar from "../city/CityStatusBar";
import { statsSufficient } from "../common/stats";
import Screen from "../layout/Screen";
import { back } from "../navigation";
import GuildExpInfo from "./GuildExpInfo";
import GuildsList from "./GuildsList";
import { GuildSpecs } from "./models";
import { $currentGuildMaster, $guildCursor } from "./state";
import { EGuild } from "./types";

export default function GuildsScreen() {
  const guildCursor = useUnit($guildCursor);
  const characterCurrentGuild = useUnit($characterGuild);
  const currentGuildMaster = useUnit($currentGuildMaster);
  const statsRequired = GuildSpecs[guildCursor].statsRequired;
  const characterGuilds = useUnit($characterGuilds);
  const characterStats = useUnit($characterStats);
  const isCurrentGuild = characterCurrentGuild === guildCursor;
  const characterReadyToLvlUp = useUnit($characterReadyToLevelUp);
  const canAffordLvlUp = useUnit($canAffordLevelUp);
  const moneyRequired = useUnit($guildLevelMoneyCost);
  const [info, toggleInfo] = useState(false);
  const isMember = !!characterGuilds.find(
    (membership) => membership.guild === guildCursor,
  );
  const canJoin = statsSufficient(characterStats, statsRequired);
  let welcomeMessage = "Your stats are too low to join this guild!";
  if (canJoin) {
    welcomeMessage = "Welcome, Visitor";
    if (isMember) {
      welcomeMessage = "Welcome, Brother";
    }
  }
  const levelUpHandler = useUnit(characterLevelsUp);
  const goBackToCity = () => {
    back();
  };
  return (
    <Screen
      header={
        <>
          <IconButton onClick={goBackToCity} size="small">
            <StoreIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Guilds
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <CityStatusBar />
      <Typography variant="h4" component="h2">
        Welcome to the {EGuild[guildCursor]}&apos;s guild.
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h5" component="h3">
              Guild master: {currentGuildMaster}
            </Typography>
            <Typography variant="h6" component="h4">
              Stats required
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Str</TableCell>
                  <TableCell>Int</TableCell>
                  <TableCell>Wis</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Cha</TableCell>
                  <TableCell>Dex</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{statsRequired.strength}</TableCell>
                  <TableCell>{statsRequired.intelligence}</TableCell>
                  <TableCell>{statsRequired.wisdom}</TableCell>
                  <TableCell>{statsRequired.endurance}</TableCell>
                  <TableCell>{statsRequired.charisma}</TableCell>
                  <TableCell>{statsRequired.dexterity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography>{welcomeMessage}</Typography>
            <ButtonGroup>
              <Button
                disabled={isCurrentGuild || !canJoin}
                onClick={() => characterJoinedGuild(guildCursor)}
              >
                {isMember ? "Re acquaint" : "Join"}
              </Button>
              <Button
                startIcon={
                  <Chip
                    component="span"
                    label={
                      <Typography component="span">{moneyRequired}</Typography>
                    }
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                }
                disabled={
                  !characterReadyToLvlUp || !isCurrentGuild || !canAffordLvlUp
                }
                onClick={levelUpHandler}
              >
                Make level
              </Button>
              <Button
                disabled={!isCurrentGuild}
                onClick={() => toggleInfo(true)}
              >
                Exp info
              </Button>
            </ButtonGroup>
          </Stack>
        </Grid>
        <Grid xs={6}>
          <GuildsList />
        </Grid>
      </Grid>
      <GuildExpInfo show={info} onClose={() => toggleInfo(false)} />
    </Screen>
  );
}
