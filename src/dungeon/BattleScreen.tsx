import { Box, Stack, Typography } from "@mui/material";
import { blueGrey, deepPurple } from "@mui/material/colors";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../assets/dungeon.jpg";
import HealthStatusProgress from "../character/HealthStatusProgress";
import { getCharacterAttack } from "../character/models";
import { $character } from "../character/state";
import MonsterCard from "../monsters/MonsterCard";
import { IGameMonster, getMonsterDV } from "../monsters/model";
import ActionButton from "./ActionButton";
import "./BattleScreen.css";
import {
  ETerrain,
  ETerrainEffect,
  IChest,
  TBattleMode,
  rollAttack,
} from "./model";

interface IBattleScreenProps {
  chest?: IChest;
  effects: Array<ETerrainEffect>;
  monsters: Array<IGameMonster>;
  terrain: ETerrain;
}

export default function BattleScreen({
  chest,
  effects,
  monsters,
  terrain,
}: IBattleScreenProps) {
  const [currentMonsters, updateCurrentMonsters] = useState(monsters);
  const [battleRound, setRound] = useState(0);
  const character = useUnit($character);
  const [mode, setMode] = useState<TBattleMode>();
  const updateMonster = (monster: IGameMonster, index: number) => {
    const updatedState = [...currentMonsters];
    updatedState.splice(index, 1, monster);
    updateCurrentMonsters(updatedState);
  };
  const attackMonster = (monster: IGameMonster, index: number) => {
    const attack = getCharacterAttack(character);
    const defense = getMonsterDV(monster);
    console.log("attack", attack, "defense", defense);
    const attackRoll = rollAttack(attack, defense);
    console.log("attack result:", attackRoll);
  };
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    // TODO: implement handling of currently selected attack/spell
    console.log("monsterAreaClicked for ", monster.monster);
    switch (mode) {
      case "fight":
        attackMonster(monster, index);
        break;
      default:
        break;
    }
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
        <Stack className="monsters" direction="row">
          {currentMonsters.map((monster, index) => (
            <div
              className="monster-area"
              key={`${index}-${monster.monster}`}
              onClick={() => monsterAreaClicked(monster, index)}
            >
              <MonsterCard monster={monster} />
            </div>
          ))}
        </Stack>
        <Box sx={{ backgroundColor: blueGrey[500] }}>
          <Typography>TODO: active effects, spells, etc. icons</Typography>
        </Box>
      </Stack>
      <HealthStatusProgress />
      <Stack direction="row" spacing={1}>
        <ActionButton
          action="fight"
          selected={mode === "fight"}
          onClick={() => setMode("fight")}
        />
        <ActionButton
          action="spells"
          selected={mode === "spells"}
          onClick={() => setMode("spells")}
        />
        <ActionButton
          action="items"
          selected={mode === "items"}
          onClick={() => setMode("items")}
        />
        <ActionButton
          action="defend"
          selected={mode === "defend"}
          onClick={() => setMode("defend")}
        />
        <ActionButton
          action="flee"
          selected={mode === "flee"}
          onClick={() => setMode("flee")}
        />
      </Stack>
      <Box sx={{ backgroundColor: deepPurple[500] }}>
        <Typography>saved actions/spells/items</Typography>
      </Box>
    </Stack>
  );
}
