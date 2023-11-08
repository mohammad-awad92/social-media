import { IsEmpty } from "class-validator";

export default class SocialMediaAccontDto {
  name?: string;
  socialPlatform?: string;

  @IsEmpty()
  email?: string;

  tokenExpireDate?: number;

  accessToken?: string;
  id: string;
  userId?: string;

  userPlatformId: string;
}
