import { Card, CardMedia, Grow, Typography } from "@mui/material";
import HPProgressBar from "../components/HPProgressBar/HPProgressBar";
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
  return (
    <Grow in={true}>
      <Card
        variant={active ? "elevation" : "outlined"}
        className={monsterCardClasses.join(" ")}
      >
        <CardMedia
          className="picture"
          image={`/src/assets/monsters/${monsterData.picture}`}
        />
        <div>
          <Typography className="monster-name">{monsterName}</Typography>
          <HPProgressBar hp={hp} hpMax={hpMax} />
        </div>
      </Card>
    </Grow>
  );
}