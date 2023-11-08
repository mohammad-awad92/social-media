import axios from "axios";
import SocailMediaAccountRepository from "../repositories/socialMediaAccount";
import PagesRepository from "../repositories/Pages";
import SocialMediaAccountRepository from "../repositories/socialMediaAccount";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import Pages from "../entities/Pages";
import { SocialMediaAcouuntService, UserService } from "../services/index";
import SocialMediaAccount from "entities/SocialMediaAcount";

const getInstagramAccount = async (
  userId: string,
  pageId: string,
  accessToken: string
) => {
  const user = await UserService.get(userId);
  const igID = await axios.get(
    `https://graph.facebook.com/v15.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
  );
  if (igID?.data.instagram_business_account) {
    const pageInfo = await axios.get(
      `https://graph.facebook.com/v15.0/${igID?.data.instagram_business_account.id}?fields=id%2Cname%2Cfollowers_count%2Cmedia_count%2Cfollows_count&access_token=${accessToken}`
    );
    await SocialMediaAccountRepository.save({
      id: pageInfo.data.id,
      name: pageInfo.data.name,
      tokenExpireDate: 0,
      socialPlatform: "Instagram",
      userPlatformId: pageInfo.data.id,
      accessToken: accessToken,
      user,
    });
  }
};

export const getUserPagesIDs = async (
  userId: string,
  socialMediaAccount: SocialMediaAccount
) => {
  const facebookRes = await axios.get(
    `https://graph.facebook.com/${socialMediaAccount.id}/accounts?access_token=${socialMediaAccount.accessToken}`
  );
  const res = [];
  console.log("facebook pages", facebookRes.data.data);
  for (let i = 0; i < facebookRes.data.data.length; i++) {
    const pageData = facebookRes.data.data[i];
    let pageExists = await PagesRepository.findByPagePlatformId(pageData.id);
    console.log("pageExists", pageExists);
    if (pageExists) {
      res.push(pageExists);
      continue;
    }
    let page = await PagesRepository.save({
      access_token: pageData.access_token,
      category: pageData.category,
      name: pageData.name,
      page_id: pageData.id,
      socailAccount: socialMediaAccount,
      accessToken: pageData.access_token,
      // social_platform: "Facebook"
    });
    res.push(page);
    await getInstagramAccount(userId, pageData.id, pageData.access_token);
  }
  console.log("res", res);
  // create should be in a separate function and should be called after creating social account
  return res;
};

export const getUserPages = async (userID: string) => {
  const socialMediaAccounts = await SocailMediaAccountRepository.findByUserId(
    userID
  );
  const facebookAccount = socialMediaAccounts.filter(
    (account) => account.socialPlatform === "Facebook"
  )[0];
  console.log("socialMediaAccounts", socialMediaAccounts);
  if (facebookAccount) return await getUserPagesIDs(userID, facebookAccount);
  return [];
};

export const getPage = async (pageId: string) => {
  return await PagesRepository.findOne(pageId);
};
