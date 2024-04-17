import { Zoom } from "@mui/material";
import { useUnit } from "effector-react";
import blood from "../assets/tiles/blood_splatter.png";
import air from "../assets/tiles/spore_cloud.png";
import { $characterHitResult } from "./state";

export default function CharacterHitAnimation() {
  const result = useUnit($characterHitResult);
  const show = !!result;
  if (!show) {
    return null;
  }
  const animtaionImg = result !== null ? blood : air;
  return (
    <Zoom in={show}>
      <img src={animtaionImg} className="hit-image" />
    </Zoom>
  );
}
