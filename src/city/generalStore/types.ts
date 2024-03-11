import { IEquipmentGameItem, IUsableGameItem } from "../../items/models";

export interface IEquipmentShopItem extends IEquipmentGameItem {
  amount: number;
  price: number;
}
export interface IUsableShopItem extends IUsableGameItem {
  amount: number;
  price: number;
}

export type TShopItem = IEquipmentShopItem | IUsableShopItem;
