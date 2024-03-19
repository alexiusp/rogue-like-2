import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import {
  $characterCurrentXp,
  $characterGuildQuest,
  $characterMaxXpForCurrentGuild,
  $characterMoney,
  $guildLevelMoneyCost,
} from "../character/state";
import { printQuest } from "../common/quests";

interface IGuildExpInfoProps {
  show: boolean;
  onClose: () => void;
}

export default function GuildExpInfo({ show, onClose }: IGuildExpInfoProps) {
  const xpRequired = useUnit($characterMaxXpForCurrentGuild);
  const currentXp = useUnit($characterCurrentXp);
  const moneyRequired = useUnit($guildLevelMoneyCost);
  const currentMoney = useUnit($characterMoney);
  const characterGuildQuest = useUnit($characterGuildQuest);
  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>Current experience information</DialogTitle>
      <DialogContent>
        <Typography>
          We require you to have {xpRequired} experience to make the next level.
        </Typography>
        <Typography>You currently have {currentXp} experience.</Typography>
        <Typography>We also require {moneyRequired} gold.</Typography>
        <Typography>You currently have {currentMoney} gold.</Typography>
        {characterGuildQuest ? (
          <Typography>
            You also need to {printQuest(characterGuildQuest)}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
