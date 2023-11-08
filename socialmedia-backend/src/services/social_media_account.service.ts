import { ResponseStatus } from "./../utils/customResponse";
import SocialMediaAccontDto from "../models/socialMediaAccount.dto";
import axios from "axios";
import SocialMediaAccount from "../entities/SocialMediaAcount";
import { UserService } from "../services/index";
import SocialMediaAccountRepository from "../repositories/socialMediaAccount";
import CustomResponse from "../utils/customResponse";

export const get = async (socialId: string): Promise<SocialMediaAccount> => {
  const socaial = await SocialMediaAccountRepository.findOne(socialId);
  if (!socaial)
    throw new CustomResponse(ResponseStatus.BAD_REQUEST, "not found socail");
  return socaial;
};

export const getByUserId = async (userId: string) => {
  return await SocialMediaAccountRepository.findByUserId(userId);
};

export const createSocialMediaAccount = async (
  userId: string,
  socialMediaAccontDto: SocialMediaAccontDto
): Promise<SocialMediaAccount> => {
  const user = await UserService.get(userId);
  const socialAccount: SocialMediaAccount = {
    ...socialMediaAccontDto,
    userPlatformId: socialMediaAccontDto.id,
    user,
  };
  return await SocialMediaAccountRepository.save({ ...socialAccount });
};
