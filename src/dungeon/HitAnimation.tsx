import { Zoom } from "@mui/material";
import { useEffect } from "react";
import blood from "../assets/tiles/blood_splatter.png";
import air from "../assets/tiles/spore_cloud.png";

interface IHitAnimationProps {
  image?: "hit" | "miss";
  onAnimationEnd: () => void;
}

export default function HitAnimation({
  image,
  onAnimationEnd,
}: IHitAnimationProps) {
  useEffect(() => {
    if (!image) {
      return;
    }
    const timeout = setTimeout(() => {
      onAnimationEnd();
    }, 500);
    return () => clearTimeout(timeout);
  }, [image, onAnimationEnd]);
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
