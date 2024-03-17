import { Zoom } from "@mui/material";
import { useUnit } from "effector-react";
import blood from "../assets/tiles/blood_splatter.png";
import air from "../assets/tiles/spore_cloud.png";
import { $hitResult } from "./state";

export default function HitAnimation() {
  const image = useUnit($hitResult);
  if (!image) {
    return null;
  }
  const animtaionImg = image === "hit" ? blood : air;
  return (
    <Zoom in={!!image} style={{ transitionDelay: !image ? "300ms" : "0ms" }}>
      <img src={animtaionImg} className="hit-image" />
    </Zoom>
  );
}
