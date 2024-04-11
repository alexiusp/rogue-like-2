import { useUnit } from "effector-react";
import { $characterAvatar } from "../../character/state";

export default function AvatarTile() {
  const characterAvatar = useUnit($characterAvatar);
  return (
    <img
      src={`/src/assets/avatars/${characterAvatar}`}
      key="character"
      alt="Character"
    />
  );
}
