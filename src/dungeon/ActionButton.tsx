import { IconButton } from "@mui/material";
import "./ActionButton.css";
import { TBattleMode } from "./model";

interface IActionButtonProps {
  action: TBattleMode;
  disabled: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function ActionButton({
  action,
  disabled,
  selected,
  onClick,
}: IActionButtonProps) {
  const color = selected ? "success" : "default";
  return (
    <IconButton
      disabled={disabled}
      className="action-button"
      color={color}
      onClick={onClick}
    >
      <img src={`/src/assets/actions/${action}.png`} />
    </IconButton>
  );
}
