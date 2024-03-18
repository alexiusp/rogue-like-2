import { Box, Stack, Typography } from "@mui/material";
import { blueGrey, deepPurple } from "@mui/material/colors";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../assets/dungeon.jpg";
import HealthStatusProgress from "../character/HealthStatusProgress";
import ActionButton from "../components/ActionButton/ActionButton";
import { ETerrain, ETerrainEffect, IChest } from "../dungeon/types";
import MonsterCard from "../monsters/MonsterCard";
import { IGameMonster } from "../monsters/model";
import "./BattleScreen.css";
import HitAnimation from "./HitAnimation";
import { $battleRound, $monstersCursor, monsterAttacked } from "./state";
import { TBattleMode } from "./types";

interface IBattleScreenProps {
  chest?: IChest;
  effects: Array<ETerrainEffect>;
  monsters: Array<IGameMonster>;
  terrain: ETerrain;
}

export default function BattleScreen({
  //chest,
  //effects,
  monsters,
  //terrain,
}: IBattleScreenProps) {
  const battleRound = useUnit($battleRound);
  const activeMonsterIndex = useUnit($monstersCursor);
  const [mode, setMode] = useState<TBattleMode>();
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    if (battleRound !== "character") {
      return;
    }
    // TODO: implement handling of currently selected attack/item/spell
    console.log("monsterAreaClicked for ", monster.monster, mode);
    switch (mode) {
      case "fight":
        monsterAttacked(index);
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
        <Box sx={{ backgroundColor: blueGrey[500] }}>
          <Typography>TODO: active effects, spells, etc. icons</Typography>
        </Box>
      </Stack>
      <HealthStatusProgress />
      <Stack direction="row" spacing={1}>
        <ActionButton
          disabled={battleRound === "monster"}
          action="fight"
          selected={mode === "fight"}
          onClick={() => setMode("fight")}
        />
        <ActionButton
          disabled={battleRound === "monster"}
          action="spells"
          selected={mode === "spells"}
          onClick={() => setMode("spells")}
        />
        <ActionButton
          disabled={battleRound === "monster"}
          action="items"
          selected={mode === "items"}
          onClick={() => setMode("items")}
        />
        <ActionButton
          disabled={battleRound === "monster"}
          action="defend"
          selected={mode === "defend"}
          onClick={() => setMode("defend")}
        />
        <ActionButton
          disabled={battleRound === "monster"}
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
