import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  Box,
  Button,
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
import { EGuild } from "../common/guilds";
import ItemDetailsDialog from "../items/ItemDetailsDialog";
import { TGameItem } from "../items/models";
import Screen from "../layout/Screen";
import { back } from "../navigation";
import InventoryList from "./InventoryList";
import {
  EGender,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
  getCharacterTotalXp,
} from "./models";
import { ECharacterRace } from "./races";
import {
  $character,
  characterDroppedAnItem,
  characterEquippedAnItem,
  characterSaved,
  characterUnequippedAnItem,
} from "./state";

type TMainTab = "char" | "guilds" | "res";
type TSecondaryTab = "inv" | "skills" | "spells";

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
  const [selectedItem, selectItem] = useState<TGameItem>();
  const equipSelectedItem = () => {
    if (
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      selectedItem.isEquipped
    ) {
      return;
    }
    selectItem(undefined);
    characterEquippedAnItem(selectedItem);
  };
  const unequipSelectedItem = () => {
    if (
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      !selectedItem.isEquipped
    ) {
      return;
    }
    selectItem(undefined);
    characterUnequippedAnItem(selectedItem);
  };
  const dropSelectedItem = () => {
    if (!selectedItem) {
      return;
    }
    selectItem(undefined);
    characterDroppedAnItem(selectedItem);
  };
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
          <Tab value="guilds" label="Guilds" />
          <Tab value="res" label="Resist." />
        </Tabs>
        <List
          dense={true}
          sx={{ display: activeMainTab === "char" ? "block" : "none" }}
        >
          <ListItem>
            <ListItemText>Age</ListItemText>
            <ListItemText primaryTypographyProps={{ align: "right" }}>
              {character.age}
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
        <List
          dense={true}
          sx={{ display: activeMainTab === "guilds" ? "block" : "none" }}
        >
          <ListItem>
            <ListItemText>Guilds info tab to be developed</ListItemText>
            <ListItemText primaryTypographyProps={{ align: "right" }}>
              ---
            </ListItemText>
          </ListItem>
        </List>
        <List
          dense={true}
          sx={{ display: activeMainTab === "res" ? "block" : "none" }}
        >
          <ListItem>
            <ListItemText>Resistanses info tab to be developed</ListItemText>
            <ListItemText primaryTypographyProps={{ align: "right" }}>
              ---
            </ListItemText>
          </ListItem>
        </List>
        <Tabs value={activeSecondaryTab} onChange={handleSecondaryTabChange}>
          <Tab value="inv" label="Inventory" />
          <Tab value="skills" label="Skills" />
          <Tab value="spells" label="Spells" />
        </Tabs>
        <Box sx={{ display: activeSecondaryTab === "inv" ? "block" : "none" }}>
          <InventoryList
            selectedItem={selectedItem}
            onItemSelect={selectItem}
          />
          <ItemDetailsDialog
            item={selectedItem}
            onClose={() => selectItem(undefined)}
            footer={
              <>
                {selectedItem &&
                selectedItem.kind === "equipable" &&
                !selectedItem.isEquipped &&
                selectedItem.idLevel === 2 ? (
                  <Button onClick={equipSelectedItem}>equip</Button>
                ) : null}
                {selectedItem &&
                selectedItem.kind === "equipable" &&
                selectedItem.isEquipped ? (
                  <Button onClick={unequipSelectedItem}>uneqip</Button>
                ) : null}
                <Button onClick={dropSelectedItem}>drop</Button>
              </>
            }
          />
        </Box>
      </Stack>
    </Screen>
  );
}
