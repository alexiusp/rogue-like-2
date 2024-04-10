import { Box, Collapse, Stack, ToggleButtonGroup } from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../assets/dungeon.webp";
import chestImage from "../assets/tiles/locked-chest.svg";
import CharacterEffectsBar from "../character/components/CharacterEffectsBar";
import HealthStatusProgress from "../character/components/HealthStatusProgress";
import ManaStatusProgress from "../character/components/ManaStatusProgress";
import SpellsList from "../character/components/SpellsList";
import UsableItemsList from "../character/components/UsableItemsList";
import { $characterIsDead } from "../character/state";
import ActionButton from "../components/ActionButton/ActionButton";
import { IChest } from "../dungeon/types";
import MonsterCard from "../monsters/MonsterCard";
import { IGameMonster } from "../monsters/model";
import "./BattleScreen.css";
import CharacterIsDead from "./CharacterIsDead";
import HitAnimation from "./HitAnimation";
import {
  $battleRound,
  $monstersCursor,
  characterDefends,
  characterTriesToFlee,
  monsterAttacked,
  monsterAttackedBySpell,
} from "./state";

interface IBattleScreenProps {
  chest?: IChest;
  //  effects: Array<ETerrainEffect>;
  monsters: Array<IGameMonster>;
  //  terrain: ETerrain;
}

type TBattleAction =
  | "fight"
  | "buffer"
  | "items"
  | "spells"
  | "defend"
  | "flee";

export default function BattleScreen({
  chest,
  //effects,
  monsters,
  //terrain,
}: IBattleScreenProps) {
  const battleRound = useUnit($battleRound);
  const activeMonsterIndex = useUnit($monstersCursor);
  const [action, setAction] = useState<TBattleAction>();
  const characterIsDead = useUnit($characterIsDead);
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    if (battleRound !== "character" || characterIsDead) {
      return;
    }
    console.log("monsterAreaClicked for ", monster.monster, action);
    switch (action) {
      case "fight":
        monsterAttacked(index);
        break;
      case "spells":
        monsterAttackedBySpell(index);
        break;
      case "items":
        monsterAttackedBySpell(index);
        break;
      default:
        break;
    }
  };

  const setDefend = () => {
    setAction("defend");
    characterDefends();
  };
  const setFlee = () => {
    setAction("flee");
    characterTriesToFlee();
  };
  return (
    <Stack direction="column" spacing={0.5} className="battle-screen">
      <Stack
        spacing={0}
        direction="column"
        className="encounter"
        sx={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <Stack spacing={0.5} className="monsters" direction="row">
          {monsters.map((monster, index) => (
            <div
              className="monster-area"
              key={`${index}-${monster.monster}`}
              onClick={() => monsterAreaClicked(monster, index)}
            >
              <MonsterCard
                active={index === activeMonsterIndex}
                monster={monster}
              />
            </div>
          ))}
        </Stack>
        <HitAnimation />
        {chest ? <img src={chestImage} alt="chest" className="chest" /> : null}
        <CharacterEffectsBar />
      </Stack>
      <HealthStatusProgress />
      <ManaStatusProgress />
      <Stack>
        <ToggleButtonGroup size="large" value={action}>
          <ActionButton
            disabled={battleRound !== "character"}
            action="fight"
            onClick={() => setAction("fight")}
          />
          <ActionButton
            disabled={battleRound !== "character"}
            action="buffer"
            onClick={() => setAction("buffer")}
          />
          <ActionButton
            disabled={battleRound !== "character"}
            action="items"
            onClick={() => setAction("items")}
          />
          <ActionButton
            disabled={battleRound !== "character"}
            action="spells"
            onClick={() => setAction("spells")}
          />
          <ActionButton
            disabled={battleRound !== "character"}
            action="defend"
            onClick={setDefend}
          />
          <ActionButton
            disabled={battleRound !== "character"}
            action="flee"
            onClick={setFlee}
          />
        </ToggleButtonGroup>
        <Box sx={{ minHeight: "72px" }}>
          <Collapse in={action === "buffer"}>
            <Box sx={{ pt: 2 }}>buffer not implemented yet</Box>
          </Collapse>
          <Collapse in={action === "items"}>
            <UsableItemsList filter="battle" />
          </Collapse>
          <Collapse in={action === "spells"}>
            <SpellsList filter="battle" />
          </Collapse>
        </Box>
      </Stack>
      <CharacterIsDead />
    </Stack>
  );
}
