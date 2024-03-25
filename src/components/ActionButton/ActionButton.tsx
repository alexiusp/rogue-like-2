import { ToggleButton } from "@mui/material";
import { TBattleMode } from "../../battle/types";
import "./ActionButton.css";

interface IActionButtonProps {
  action: TBattleMode;
  disabled: boolean;
  onClick?: () => void;
}

export default function ActionButton({
  action,
  disabled,
  onClick,
}: IActionButtonProps) {
  return (
    <ToggleButton
      value={action}
      className="action-button"
      disabled={disabled}
      size="large"
      onClick={onClick}
    >
      <img src={`/src/assets/actions/${action}.svg`} />
    </ToggleButton>
  );
}
