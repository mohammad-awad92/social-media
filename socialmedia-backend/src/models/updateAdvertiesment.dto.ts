import { AdvertisementType } from "./../utils/types";
import { Status_AD } from "../utils/types";

export default class updateAdvertisementDTO {
  name_Ad?: string;

  Description_AD?: string;

  Price_AD?: number;

  Status_Ad?: Status_AD;

  img?: string;

  link?: string;

  userId?: string;

  sourceId: string;

  sourceType: AdvertisementType;
}
