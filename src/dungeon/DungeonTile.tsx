import { Button } from "@mui/material";
import { ReactNode } from "react";
import avatar from "../assets/avatar.png";
import ladder from "../assets/tiles/ladder1.png";
import pit from "../assets/tiles/pit.png";
import { ETerrain, IMapTile } from "./model";

interface IDungeonTileProps {
  character?: boolean;
  tile: IMapTile;
}

export default function DungeonTile({ character, tile }: IDungeonTileProps) {
  const { open, terrain, effects, encounter } = tile;
  let terrainImg: ReactNode = null;
  const avatarImg = character ? <img src={avatar} /> : null;
  const buttonClassNames = ["cell"];
  if (open) {
    buttonClassNames.push("open");
    switch (terrain) {
      case ETerrain.Chute:
      case ETerrain.Pit:
        terrainImg = (
          <img src={pit} style={{ objectFit: "cover", width: "100%" }} />
        );
        break;
      case ETerrain.StairsDown:
      case ETerrain.StairsUp:
        terrainImg = (
          <img src={ladder} style={{ objectFit: "cover", width: "100%" }} />
        );
        break;
      default:
        break;
    }
  }
  const classes = buttonClassNames.join(" ");
  return (
    <Button className={classes} focusRipple>
      {terrainImg}
      {avatarImg}
    </Button>
  );
}
