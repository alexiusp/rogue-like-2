import { Card, CardMedia, Grow, Typography } from "@mui/material";
import skulls from "../assets/tiles/skull-crossed-bones.svg";
import ProgressBar from "../components/ProgressBar";
import GlobalMonsterCatalogue from "./GlobalMonsterCatalogue";
import "./MonsterCard.css";
import { EAggroMode, IGameMonster } from "./model";

interface IMonsterCardProps {
  monster: IGameMonster;
  active: boolean;
}

export default function MonsterCard({ active, monster }: IMonsterCardProps) {
  const { hp, hpMax, aggro, monster: monsterName } = monster;
  const monsterData = GlobalMonsterCatalogue[monsterName];
  const monsterCardClasses = ["monster"];
  switch (aggro) {
    case EAggroMode.Angry:
      monsterCardClasses.push("angry");
      break;
    case EAggroMode.Neutral:
      monsterCardClasses.push("neutral");
      break;
    case EAggroMode.Peaceful:
      monsterCardClasses.push("peaceful");
      break;
    default:
      break;
  }
  const picture =
    hp <= 0 ? skulls : `/src/assets/monsters/${monsterData.picture}`;
  return (
    <Grow in={true}>
      <Card
        variant={active ? "elevation" : "outlined"}
        className={monsterCardClasses.join(" ")}
      >
        <CardMedia className="picture" image={picture} />
        <div>
          <Typography className="monster-name">{monsterName}</Typography>
          <ProgressBar current={hp} max={hpMax} color="error" />
        </div>
      </Card>
    </Grow>
  );
}
