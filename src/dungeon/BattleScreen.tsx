import { Box, Stack, Typography } from "@mui/material";
import { blueGrey, deepPurple } from "@mui/material/colors";
import { useUnit } from "effector-react";
import { useCallback, useEffect, useState } from "react";
import bg from "../assets/dungeon.jpg";
import HealthStatusProgress from "../character/HealthStatusProgress";
import {
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
} from "../character/models";
import { $character, characterHpChanged } from "../character/state";
import MonsterCard from "../monsters/MonsterCard";
import {
  EAggroMode,
  IGameMonster,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import ActionButton from "./ActionButton";
import "./BattleScreen.css";
import HitAnimation from "./HitAnimation";
import {
  ETerrain,
  ETerrainEffect,
  IChest,
  TBattleMode,
  rollAttack,
  rollDamage,
} from "./model";

interface IBattleScreenProps {
  chest?: IChest;
  effects: Array<ETerrainEffect>;
  monsters: Array<IGameMonster>;
  terrain: ETerrain;
}

type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export default function BattleScreen({
  //chest,
  //effects,
  monsters,
  //terrain,
}: IBattleScreenProps) {
  const character = useUnit($character);
  const [currentMonsters, updateCurrentMonsters] = useState(monsters);
  const [battleRound, setRound] = useState<TBattleRound>("character");
  const [animateHit, setHitAnimation] = useState<"hit" | "miss" | undefined>();
  const handleMonstersRound = useCallback(() => {
    // iterate on monsters
    for (const monster of currentMonsters) {
      // skip monsters not angry and dead
      if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
        continue;
      }
      const attack = getMonsterAttack(monster);
      const defense = getCharacterDefense(character);
      console.log("attack", attack, "defense", defense);
      const attackRoll = rollAttack(attack, defense);
      console.log("attack result:", attackRoll);
      if (!attackRoll) {
        setHitAnimation("miss");
        return;
      }
      const damage = getMonsterDamage(monster);
      console.log("damage", damage);
      const protection = getCharacterProtection(character);
      console.log("protection", protection);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      setHitAnimation("hit");
      const hp = Math.max(character.hp - damageDone, 0);
      characterHpChanged(hp);
      // TODO: handle character killed case
    }
  }, [currentMonsters, character]);
  useEffect(() => {
    if (battleRound === "character" || battleRound === "monster") {
      return;
    }
    const timeout = setTimeout(() => {
      if (battleRound === "character-to-monster") {
        setRound("monster");
      } else {
        setRound("character");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [battleRound, setRound]);
  useEffect(() => {
    // check which round is it
    if (battleRound !== "monster") {
      return;
    }
    console.log("start monsters round");
    handleMonstersRound();
    console.log("end monsters round");
    setRound("monster-to-character");
  }, [battleRound, handleMonstersRound, setRound]);
  const [mode, setMode] = useState<TBattleMode>();
  const updateMonster = (monster: IGameMonster, index: number) => {
    const updatedState = [...currentMonsters];
    updatedState.splice(index, 1, monster);
    updateCurrentMonsters(updatedState);
  };
  const monsterKilled = () => {
    // TODO: implement monster killed flow:
    // xp/gold/loot reward, optional chest opening
  };
  const attackMonster = (monster: IGameMonster, index: number) => {
    // TODO: other monsters in room must also get angry if not charmed
    monster.aggro = EAggroMode.Angry;
    const attack = getCharacterAttack(character);
    const defense = getMonsterDV(monster);
    console.log("attack", attack, "defense", defense);
    const attackRoll = rollAttack(attack, defense);
    console.log("attack result:", attackRoll);
    if (!attackRoll) {
      setHitAnimation("miss");
      updateMonster(monster, index);
      setRound("character-to-monster");
      return;
    }
    const damage = getCharacterDamage(character);
    console.log("damage", damage);
    const protection = getMonsterPV(monster);
    console.log("protection", protection);
    const damageDone = rollDamage(damage, protection);
    console.log("damageDone", damageDone);
    setHitAnimation("hit");
    monster.hp = Math.max(monster.hp - damageDone, 0);
    if (monster.hp === 0) {
      // TODO: check if monster is killed
      monsterKilled();
    }
    updateMonster(monster, index);
    setRound("character-to-monster");
  };
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    if (battleRound !== "character") {
      return;
    }
    // TODO: implement handling of currently selected attack/spell
    console.log("monsterAreaClicked for ", monster.monster, mode);
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
        <HitAnimation
          image={animateHit}
          onAnimationEnd={() => setHitAnimation(undefined)}
        />
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
