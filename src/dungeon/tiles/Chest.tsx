import lockedChest from "../../assets/tiles/locked-chest.svg";
import openChest from "../../assets/tiles/open-chest.svg";
import { IChest } from "../types";

interface IChestProps {
  chest?: IChest;
}
export default function Chest({ chest }: IChestProps) {
  if (!chest) {
    return null;
  }
  return <img src={chest.isOpened ? openChest : lockedChest} alt="chest" />;
}
