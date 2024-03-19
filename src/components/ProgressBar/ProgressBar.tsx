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
}

export default function ProgressBar({
  current,
  max,
  color,
}: IHPProgressBarProps) {
  const label = `${current} / ${max}`;
  const value = Math.round((current / max) * 100);
  return (
    <Box className="progress">
      <LinearProgress
        className="progress-bar"
        variant="determinate"
        color={color}
        value={value}
      />
      <Typography className="progress-label">{label}</Typography>
    </Box>
  );
}
