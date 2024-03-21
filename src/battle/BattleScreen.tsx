import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { blueGrey, deepPurple } from "@mui/material/colors";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../assets/dungeon.webp";
import HealthStatusProgress from "../character/HealthStatusProgress";
import ManaStatusProgress from "../character/ManaStatusProgress";
import { $characterIsDead } from "../character/state";
import ActionButton from "../components/ActionButton/ActionButton";
import { ETerrain, ETerrainEffect, IChest } from "../dungeon/types";
import MonsterCard from "../monsters/MonsterCard";
import { IGameMonster } from "../monsters/model";
import "./BattleScreen.css";
import HitAnimation from "./HitAnimation";
import {
  $battleRound,
  $monstersCursor,
  monsterAttacked,
  waitForRescueTeam,
} from "./state";
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
  const characterIsDead = useUnit($characterIsDead);
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    if (battleRound !== "character" || characterIsDead) {
      return;
    }
    console.log("monsterAreaClicked for ", monster.monster, mode);
    switch (mode) {
      case "fight":
        monsterAttacked(index);
        break;
      default:
        break;
    }
  };
  const waitForRescue = useUnit(waitForRescueTeam);
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
      <ManaStatusProgress />
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
      <Dialog open={characterIsDead}>
        <DialogTitle>You are dead!</DialogTitle>
        <DialogContent>
          <Typography>
            You died in the Dungeon. Please wait for some other dungeon explorer
            to find your body and morgue worker to resurrect you.
          </Typography>
          <Typography>
            Remember that there is always a risk of &quot;complications&quot; as
            result of a resurrect spell.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" onClick={waitForRescue}>
            Wait for rescue
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
