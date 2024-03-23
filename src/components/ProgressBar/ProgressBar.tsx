import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import "./ProgressBar.css";

interface IHPProgressBarProps {
  current: number;
  max: number;
  color: LinearProgressProps["color"];
  pulsate?: boolean;
}

export default function ProgressBar({
  current,
  max,
  color,
  pulsate,
}: IHPProgressBarProps) {
  const label = `${current} / ${max}`;
  const value = Math.round((Math.min(current, max) / max) * 100);
  return (
    <Box className="progress">
      <LinearProgress
        className={`progress-bar${pulsate ? " pulsate" : ""}`}
        variant="determinate"
        color={color}
        value={value}
      />
      <Typography
        color={color === "inherit" ? "InfoText" : "inherit"}
        className="progress-label"
      >
        {label}
      </Typography>
    </Box>
  );
}
