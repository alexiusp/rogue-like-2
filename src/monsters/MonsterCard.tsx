import { Card, CardMedia, Grow, Typography } from "@mui/material";
import skulls from "../assets/tiles/skull-crossed-bones.svg";
import ProgressBar from "../components/ProgressBar";
import EffectIcon from "../magic/effects/EffectIcon";
import GlobalMonsterCatalogue from "./GlobalMonsterCatalogue";
import "./MonsterCard.css";
import { EAggroMode, IGameMonster } from "./model";

interface IMonsterCardProps {
  active: boolean;
  isHit?: number | null;
  monster: IGameMonster;
}

export default function MonsterCard({
  active,
  isHit,
  monster,
}: IMonsterCardProps) {
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
  if (typeof isHit !== "undefined" && isHit !== null) {
    monsterCardClasses.push("hit");
  }
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
        <div className="hit-area">{isHit}</div>
      </Card>
    </Grow>
  );
}
