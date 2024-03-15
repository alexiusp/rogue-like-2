import { Box, Stack, Typography, Zoom } from "@mui/material";
import { blueGrey, deepPurple } from "@mui/material/colors";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import bg from "../assets/dungeon.jpg";
import blood from "../assets/tiles/blood_splatter.png";
import air from "../assets/tiles/spore_cloud.png";
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

type TBattleRound = "character" | "monster";

export default function BattleScreen({
  chest,
  effects,
  monsters,
  terrain,
}: IBattleScreenProps) {
  const character = useUnit($character);
  const [currentMonsters, updateCurrentMonsters] = useState(monsters);
  const [battleRound, setRound] = useState<TBattleRound>("character");
  const [animateHit, setHitAnimation] = useState(false);
  useEffect(() => {
    if (!animateHit) {
      return;
    }
    const timeout = setTimeout(() => {
      setHitAnimation(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [animateHit, setHitAnimation]);
  useEffect(() => {
    // check which round is it
    if (battleRound !== "monster") {
      return;
    }
    console.log("start monsters round");
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
        setHitImage(air);
        setHitAnimation(true);
        setRound("character");
      }
      const damage = getMonsterDamage(monster);
      console.log("damage", damage);
      const protection = getCharacterProtection(character);
      console.log("protection", protection);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      setHitImage(blood);
      setHitAnimation(true);
      const hp = Math.max(character.hp - damage, 0);
      characterHpChanged(hp);
      setRound("character");
      // TODO: handle character killed case
    }
  }, [battleRound, currentMonsters, character]);
  const [hitImage, setHitImage] = useState(blood);
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
      setHitImage(air);
      setHitAnimation(true);
      updateMonster(monster, index);
      setRound("monster");
      return;
    }
    const damage = getCharacterDamage(character);
    console.log("damage", damage);
    const protection = getMonsterPV(monster);
    console.log("protection", protection);
    const damageDone = rollDamage(damage, protection);
    console.log("damageDone", damageDone);
    setHitImage(blood);
    setHitAnimation(true);
    monster.hp = Math.max(monster.hp - damage, 0);
    if (monster.hp === 0) {
      // TODO: check if monster is killed
      monsterKilled();
    }
    updateMonster(monster, index);
    setRound("monster");
  };
  const monsterAreaClicked = (monster: IGameMonster, index: number) => {
    if (battleRound !== "character") {
      return;
    }
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
              <Zoom
                in={animateHit}
                style={{ transitionDelay: !animateHit ? "300ms" : "0ms" }}
              >
                <img src={hitImage} className="hit-image" />
              </Zoom>
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
