import { Button } from "@mui/material";
import { ReactNode } from "react";
import avatar from "../assets/avatar.png";
import fog from "../assets/tiles/fog.webp";
import ladder from "../assets/tiles/ladder1.png";
import pit from "../assets/tiles/pit.png";
import skull from "../assets/tiles/skull.png";
import water from "../assets/tiles/water.webp";
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
  const { open, terrain, effects, encounter, x, y } = tile;
  const tileImages: ReactNode[] = [];
  const buttonClassNames = ["cell"];
  if (open) {
    buttonClassNames.push("open");
    switch (terrain) {
      case ETerrain.Chute:
      case ETerrain.Pit:
        tileImages.push(
          <img src={pit} alt={ETerrain[terrain]} key={`terrain-${terrain}`} />,
        );
        break;
      case ETerrain.StairsDown:
      case ETerrain.StairsUp:
        tileImages.push(
          <img
            src={ladder}
            alt={ETerrain[terrain]}
            key={`terrain-${terrain}`}
          />,
        );
        break;
      default:
        break;
    }
    if (effects) {
      for (const effect of effects) {
        switch (effect) {
          case ETerrainEffect.Water:
            tileImages.push(
              <img
                src={water}
                alt={ETerrainEffect[effect]}
                key={`effect-${effect}`}
              />,
            );
            break;
          case ETerrainEffect.Darkness:
            buttonClassNames.push("dark");
            break;
          case ETerrainEffect.Fog:
            tileImages.push(
              <img
                src={fog}
                alt={ETerrainEffect[effect]}
                key={`effect-${effect}`}
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
          tileImages.push(
            <img
              src={skull}
              alt={EEncounterType[type]}
              key={`encounter-${type}`}
            />,
          );
          break;

        default:
          break;
      }
    }
  }
  if (character) {
    tileImages.push(<img src={avatar} key="character" alt="Character" />);
  }
  const classes = buttonClassNames.join(" ");
  return (
    <Button className={classes} focusRipple onClick={() => onClick({ x, y })}>
      {tileImages}
    </Button>
  );
}
