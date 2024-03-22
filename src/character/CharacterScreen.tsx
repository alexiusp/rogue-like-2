import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import { getAlignmentLong } from "../common/alignment";
import { EGuild } from "../guilds/types";
import Screen from "../layout/Screen";
import { back } from "../navigation";
import CharacterAgeLabel from "./CharacterAgeLabel";
import GuildsTab from "./characterTabs/GuildsTab";
import InventoryTab from "./characterTabs/InventoryTab";
import ResistansesTab from "./characterTabs/ResistansesTab";
import SpellsTab from "./characterTabs/SpellsTab";
import {
  EGender,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
  getCharacterTotalXp,
} from "./models";
import { ECharacterRace } from "./races";
import { $character, characterSaved } from "./state";

type TMainTab = "char" | "guilds" | "res";
type TSecondaryTab = "inv" | "buffers" | "spells";

export default function CharacterScreen() {
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
  const character = useUnit($character);
  const currentGuild = character.guild;
  const currentGuildInfo = character.guilds.find(
    (g) => g.guild === currentGuild,
  );
  const goBackToCity = () => {
    characterSaved();
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
      <Stack direction="column" spacing={2}>
        <Typography align="center" variant="h4" component="h2">
          {EGender[character.gender]} {ECharacterRace[character.race]} (
          {getAlignmentLong(character.alignment)})
        </Typography>
        <Typography align="center" variant="h4" component="h2">
          {EGuild[currentGuildInfo.guild]} ({currentGuildInfo.level})
        </Typography>
        <Tabs value={activeMainTab} onChange={handleMainTabChange}>
          <Tab value="char" label="Character" />
          <Tab value="guilds" label="Guilds & skills" />
          <Tab value="res" label="Resistances" />
        </Tabs>
        <List
          dense={true}
          sx={{ display: activeMainTab === "char" ? "block" : "none" }}
        >
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
              {getCharacterAttack(character)} / {getCharacterDamage(character)}
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
        <GuildsTab show={activeMainTab === "guilds"} />
        <ResistansesTab show={activeMainTab === "res"} />
        <Tabs value={activeSecondaryTab} onChange={handleSecondaryTabChange}>
          <Tab value="inv" label="Inventory" />
          <Tab value="spells" label="Spells" />
          <Tab value="buffers" label="Hotkeys" disabled={true} />
        </Tabs>
        <InventoryTab show={activeSecondaryTab === "inv"} />
        <SpellsTab show={activeSecondaryTab === "spells"} />
      </Stack>
    </Screen>
  );
}
