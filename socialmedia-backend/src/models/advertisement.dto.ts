import { IsNotEmpty, Length, IsNumber, IsEnum } from "class-validator";
import Pages from "entities/Pages";
import SocialMediaAccount from "entities/SocialMediaAcount";
import { SocialPlatform, Status_AD } from "../utils/types";
import { AdvertisementType } from "../utils/types";

export default class AdvertisementDTO {
  name_Ad?: string;

  @IsNotEmpty()
  Description_AD: string;

  // @IsNotEmpty()
  // pageId: string;

  Price_AD?: number;

  @IsEnum(Status_AD)
  Status_Ad?: Status_AD;

  @IsNotEmpty()
  socialPlatform?: SocialPlatform[];

  pages: Pages[];

  socialAccounts: SocialMediaAccount[];

  img?: string;

  link?: string;

  sourceId?: string;

  sourceType?: AdvertisementType;

  userId: string;

  advertisementId?: string;
}
