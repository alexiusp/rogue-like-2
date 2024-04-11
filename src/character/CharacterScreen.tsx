import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { useState } from "react";
import { getAlignmentLong } from "../common/alignment";
import { EGuild } from "../guilds/types";
import Screen from "../layout/Screen";
import { back } from "../navigation";
import GuildsTab from "./characterTabs/GuildsTab";
import InventoryTab from "./characterTabs/InventoryTab";
import ResistansesTab from "./characterTabs/ResistansesTab";
import SpellsTab from "./characterTabs/SpellsTab";
import CharacterAgeLabel from "./components/CharacterAgeLabel";
import StatsList from "./components/StatsList";
import {
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
  getCharacterTotalXp,
} from "./models";
import { ECharacterRace } from "./races";
import { $characterAvatar, $characterGuild, $characterState } from "./state";
import { EGender } from "./types";

type TMainTab = "char" | "guilds" | "res";
type TSecondaryTab = "inv" | "buffers" | "spells";

export default function CharacterScreen() {
  const characterAvatar = useUnit($characterAvatar);
  const [activeMainTab, toggleMainTab] = useState<TMainTab>("char");
  const [activeSecondaryTab, toggleSecondaryTab] =
    useState<TSecondaryTab>("inv");
  const handleMainTabChange = (_: React.SyntheticEvent, newValue: TMainTab) => {
    toggleMainTab(newValue);
  };
  const handleSecondaryTabChange = (
    _: React.SyntheticEvent,
    newValue: TSecondaryTab,
  ) => {
    toggleSecondaryTab(newValue);
  };
  const character = useUnit($characterState);
  const currentGuild = useUnit($characterGuild);
  const currentGuildInfo = character.guilds.find(
    (g) => g.guild === currentGuild,
  );
  const goBackToCity = () => {
    back();
  };
  if (!currentGuildInfo) {
    return null;
  }
  return (
    <Screen
      header={
        <>
          <IconButton onClick={goBackToCity} size="small">
            <AccountBoxIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            {character.name}
          </Typography>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid xs={12} container>
          <Grid xs={3}>
            <Avatar
              alt="character's avatar"
              src={`/src/assets/avatars/${characterAvatar}`}
              sx={{ width: "128px", height: "128px" }}
            />
          </Grid>
          <Grid xs={9}>
            <Typography variant="h4" component="h2">
              {EGender[character.gender]} {ECharacterRace[character.race]} (
              {getAlignmentLong(character.alignment)})
            </Typography>
            <Typography variant="h4" component="h2">
              {EGuild[currentGuildInfo.guild]} ({currentGuildInfo.level})
            </Typography>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Tabs value={activeMainTab} onChange={handleMainTabChange}>
            <Tab value="char" label="Character" />
            <Tab value="guilds" label="Guilds & skills" />
            <Tab value="res" label="Resistances & Effects" />
          </Tabs>
          <Box sx={{ display: activeMainTab === "char" ? "block" : "none" }}>
            <List dense={true}>
              <ListItem>
                <ListItemText>Age</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  <CharacterAgeLabel age={character.age} />
                </ListItemText>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText>Mana</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {character.mp}/{character.mpMax}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Health</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {character.hp}/{character.hpMax}
                </ListItemText>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText>Attack/Damage</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {getCharacterAttack(character)} /{" "}
                  {getCharacterDamage(character)}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Defense/Protection</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {getCharacterDefense(character)} /{" "}
                  {getCharacterProtection(character)}
                </ListItemText>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText>Exp</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {getCharacterTotalXp(character)}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Gold</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {character.money}
                </ListItemText>
              </ListItem>
            </List>
            <Divider />
            <StatsList />
          </Box>
          <GuildsTab show={activeMainTab === "guilds"} />
          <ResistansesTab show={activeMainTab === "res"} />
          <Tabs value={activeSecondaryTab} onChange={handleSecondaryTabChange}>
            <Tab value="inv" label="Inventory" />
            <Tab value="spells" label="Spells" />
            <Tab value="buffers" label="Hotkeys" disabled={true} />
          </Tabs>
          <InventoryTab show={activeSecondaryTab === "inv"} />
          <SpellsTab show={activeSecondaryTab === "spells"} />
        </Grid>
      </Grid>
    </Screen>
  );
}
