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
  let progress = <LinearProgress className="progress-bar" color={color} />;
  if (current <= max) {
    const value = Math.round((current / max) * 100);
    progress = (
      <LinearProgress
        className="progress-bar"
        variant="determinate"
        color={color}
        value={value}
      />
    );
  }
  return (
    <Box className="progress">
      {progress}
      <Typography className="progress-label">{label}</Typography>
    </Box>
  );
}
