import { Typography } from "@mui/material";

interface ITalksTabProps {
  show: boolean;
}
export default function TalksTab({ show }: ITalksTabProps) {
  if (!show) {
    return;
  }
  return <Typography>To Be Implemented: quests</Typography>;
}
