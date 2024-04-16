import { Zoom } from "@mui/material";
import { useUnit } from "effector-react";
import blood from "../assets/tiles/blood_splatter.png";
import air from "../assets/tiles/spore_cloud.png";
import { $characterHitResult } from "./state";

export default function CharacterHitAnimation() {
  const image = useUnit($characterHitResult);
  const show = !!image;
  if (!show) {
    return null;
  }
  const animtaionImg = image === "hit" ? blood : air;
  return (
    <Zoom in={show}>
      <img src={animtaionImg} className="hit-image" />
    </Zoom>
  );
}
