import { Box, Button } from "@mui/material";
import { ReactNode } from "react";
import danger from "../assets/tiles/danger.svg";
import down from "../assets/tiles/dungeon-down.svg";
import up from "../assets/tiles/dungeon-up.svg";
import fog from "../assets/tiles/fog.webp";
import pit from "../assets/tiles/pit.png";
import tombstone from "../assets/tiles/tombstone.svg";
import water from "../assets/tiles/water.webp";
import { areAllMonstersDead } from "../monsters/model";
import { MAX_RESPAWN_TIMEOUT } from "./dungeonSpecs";
import { isTileStairs } from "./model";
import AvatarTile from "./tiles/AvatarTile";
import Chest from "./tiles/Chest";
import {
  EEncounterType,
  ETerrain,
  ETerrainEffect,
  IMapCoordinates,
  TMapTile,
} from "./types";

interface IDungeonTileProps {
  character?: boolean;
  tile: TMapTile;
  onClick: (pos: IMapCoordinates) => void;
}

export default function DungeonTile({
  character,
  tile,
  onClick,
}: IDungeonTileProps) {
  const { open, terrain, x, y } = tile;
  const tileLayers: ReactNode[] = [];
  const buttonClassNames = ["cell"];
  let fowLevel = 0;
  if (open) {
    buttonClassNames.push("open");
    switch (terrain) {
      case ETerrain.Chute:
      case ETerrain.Pit:
        tileLayers.push(
          <img
            src={pit}
            alt={ETerrain[terrain]}
            key={`${x}-${y}-terrain-${terrain}`}
          />,
        );
        break;
      case ETerrain.Water:
        tileLayers.push(
          <img
            src={water}
            alt={ETerrain[terrain]}
            key={`${x}-${y}-terrain-${terrain}`}
          />,
        );
        break;
      default:
        break;
    }
    if (isTileStairs(tile)) {
      if (tile.direction == "down") {
        tileLayers.push(
          <img src={down} alt={"ladder-down"} key={`ladder-down`} />,
        );
      } else {
        tileLayers.push(<img src={up} alt={"ladder-up"} key={`ladder-up`} />);
      }
    } else {
      const { effects, encounter, respawnTimer } = tile;
      if (effects) {
        for (const effect of effects) {
          switch (effect) {
            case ETerrainEffect.Darkness:
              buttonClassNames.push("dark");
              break;
            case ETerrainEffect.Fog:
              tileLayers.push(
                <img
                  src={fog}
                  alt={ETerrainEffect[effect]}
                  key={`${x}-${y}-effect-${effect}`}
                />,
              );
              break;
            default:
              break;
          }
        }
      }
      if (encounter) {
        const { type } = encounter;
        switch (type) {
          case EEncounterType.Monster:
            if (areAllMonstersDead(encounter.monsters)) {
              if (encounter.chest) {
                tileLayers.push(
                  <Chest
                    key={`${x}-${y}-encounter-${type}`}
                    chest={encounter.chest}
                  />,
                );
              } else {
                tileLayers.push(
                  <img
                    src={tombstone}
                    alt={"dead monsters"}
                    key={`${x}-${y}-encounter-${type}`}
                  />,
                );
              }
            } else {
              tileLayers.push(
                <img
                  src={danger}
                  alt={"alive monsters"}
                  key={`${x}-${y}-encounter-${type}`}
                />,
              );
            }
            break;
          case EEncounterType.Chest: {
            tileLayers.push(
              <Chest
                key={`${x}-${y}-encounter-${type}`}
                chest={encounter.chest}
              />,
            );
            break;
          }
          default:
            break;
        }
      }
      fowLevel = respawnTimer / MAX_RESPAWN_TIMEOUT;
    }
  }
  let characterLayer = null;
  if (character) {
    characterLayer = <AvatarTile />;
  }
  const classes = buttonClassNames.join(" ");
  return (
    <Button className={classes} focusRipple onClick={() => onClick({ x, y })}>
      {tileLayers}
      <Box className="fog-of-war" sx={{ opacity: fowLevel }} />
      {characterLayer}
    </Button>
  );
}
