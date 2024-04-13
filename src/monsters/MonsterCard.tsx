import { Card, CardMedia, Grow, Typography } from "@mui/material";
import skulls from "../assets/tiles/skull-crossed-bones.svg";
import ProgressBar from "../components/ProgressBar";
import EffectIcon from "../magic/effects/EffectIcon";
import GlobalMonsterCatalogue from "./GlobalMonsterCatalogue";
import "./MonsterCard.css";
import { EAggroMode, IGameMonster } from "./model";

interface IMonsterCardProps {
  monster: IGameMonster;
  active: boolean;
}

export default function MonsterCard({ active, monster }: IMonsterCardProps) {
  const { effects, hp, hpMax, aggro, monster: monsterName } = monster;
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
  const effectsIcons = effects
    ? effects.map((ef, index) => (
        <EffectIcon
          key={`${index}-${ef.name}`}
          effectName={ef.name}
          size="small"
          timeout={ef.timeout}
        />
      ))
    : null;
  return (
    <Grow in={true}>
      <Card
        variant={active ? "elevation" : "outlined"}
        className={monsterCardClasses.join(" ")}
      >
        <CardMedia className="picture" image={picture}>
          {effectsIcons}
        </CardMedia>
        <div>
          <Typography className="monster-name">{monsterName}</Typography>
          <ProgressBar current={hp} max={hpMax} color="error" />
        </div>
      </Card>
    </Grow>
  );
}
