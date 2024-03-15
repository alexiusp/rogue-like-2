import { Box, LinearProgress, Typography } from "@mui/material";
import "./HPProgressBar.css";

interface IHPProgressBarProps {
  hp: number;
  hpMax: number;
}

export default function HPProgressBar({ hp, hpMax }: IHPProgressBarProps) {
  const label = `${hp} / ${hpMax}`;
  const value = Math.round((hp / hpMax) * 100);
  return (
    <Box className="hp-progress">
      <LinearProgress
        className="progress-bar"
        variant="determinate"
        color="error"
        value={value}
      />
      <Typography className="progress-label">{label}</Typography>
    </Box>
  );
}
