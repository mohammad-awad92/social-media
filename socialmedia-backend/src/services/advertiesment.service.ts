import { AdvertisementType } from "./../utils/types";
import updateAdvertisementDTO from "../models/updateAdvertiesment.dto";
import AdvertisementDTO from "../models/advertisement.dto";
import Advertisement from "../entities/Advertisement";
import AdvertisementRepository from "../repositories/Advertisement";
import {
  AdvertisementService,
  PagesService,
  SocialMediaAcouuntService,
  UserService,
} from "../services/index";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import axios from "axios";
import { SocialPlatform, Status_AD } from "../utils/types";
import Pages from "entities/Pages";
import SocialMediaAccount from "entities/SocialMediaAcount";
import PagesRepository from "../repositories/Pages";
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

export const get = async (advertisementId: string) => {
  const adver = await AdvertisementRepository.findById(advertisementId);
  if (!adver)
    throw new CustomResponse(
      ResponseStatus.BAD_REQUEST,
      "Advertiesment Not Found"
    );
  return adver;
};

export const create = async (
  advertisementDTO: AdvertisementDTO,
  userId: string
): Promise<Advertisement[]> => {
  try {
    const res = [];
    let facebookAds, instaAds;
    const user = await UserService.get(userId);

    if (advertisementDTO.Status_Ad === Status_AD.PUBLISH) {
      if (advertisementDTO.socialPlatform.includes(SocialPlatform.FACEBOOK)) {
        facebookAds = await publishFacebookPost(
          advertisementDTO.pages,
          advertisementDTO.Description_AD
        );
      }
      if (advertisementDTO.socialPlatform.includes(SocialPlatform.INSTAGRAM)) {
        instaAds = await publishInstagramPost(
          advertisementDTO.socialAccounts,
          advertisementDTO.Description_AD,
          advertisementDTO.img
        );
      }
      if (advertisementDTO.socialPlatform.includes(SocialPlatform.TWITTER)) {
        let ad = await publishTwitterTweet(advertisementDTO.Description_AD);
        await AdvertisementRepository.save({
          img: advertisementDTO.img,
          Description_AD: advertisementDTO.Description_AD,
          Status_Ad: advertisementDTO.Status_Ad,
          sourceId: "",
          sourceType: AdvertisementType.TWITTER,
          advertisementId: ad.data?.id,
          user,
        });
      }
    }
    for (let i = 0; i < advertisementDTO.pages.length; i++) {
      let facebookAdId =
        facebookAds?.filter(
          (ad) => ad.id.split("_")[0] === advertisementDTO.pages[i].page_id
        )[0] || "";
      console.log("facebookAdId", facebookAdId);
      let advertisement = await AdvertisementRepository.save({
        img: advertisementDTO.img,
        Description_AD: advertisementDTO.Description_AD,
        Status_Ad: advertisementDTO.Status_Ad,
        sourceId: advertisementDTO.pages[i].page_id,
        sourceType: AdvertisementType.PAGE,
        advertisementId: facebookAdId.id,
        user,
      });
      res.push(advertisement);
    }

    for (let i = 0; i < advertisementDTO.socialAccounts.length; i++) {
      let instaAdId = instaAds?.[i].id || "";
      let advertisement = await AdvertisementRepository.save({
        img: advertisementDTO.img,
        Description_AD: advertisementDTO.Description_AD,
        Status_Ad: advertisementDTO.Status_Ad,
        sourceId: advertisementDTO.socialAccounts[i].id,
        sourceType: AdvertisementType.ACCOUNT,
        advertisementId: instaAdId,
        user,
      });
      res.push(advertisement);
    }

    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export const update = async (
  advertiesmentId: string,
  updateAdvertisementDTO: updateAdvertisementDTO
): Promise<Advertisement> => {
  const advertiesment = await get(advertiesmentId);
  return AdvertisementRepository.save({
    ...advertiesment,
    ...updateAdvertisementDTO,
  });
};

export const remove = async (
  adId: string,
  adDbId: string,
  sourceId: string,
  sourceType: AdvertisementType
) => {
  // const advertiesment: Advertisement = await get(adId);
  let source: Pages | SocialMediaAccount;
  const advertisement = await AdvertisementService.get(adDbId);
  if (sourceType === AdvertisementType.PAGE) {
    source = await PagesRepository.findByPagePlatformId(sourceId);
    const res = await axios.delete(
      `https://graph.facebook.com/${adId}?access_token=${source.accessToken}`
    );
    console.log("delete post res ", res.data);
    return await AdvertisementRepository.remove(advertisement);
  } else if (sourceType === AdvertisementType.TWITTER) {
    await deleteTwitterTweet(adId);
    return await AdvertisementRepository.remove(advertisement);
  } else {
    source = await SocialMediaAcouuntService.get(sourceId);
  }
};

export const publishFacebookPost = async (
  pages: Pages[],
  description: string
) => {
  const res = [];
  for (const page of pages) {
    let ad = await axios.post(
      `https://graph.facebook.com/${page.page_id}/feed?message=${description}&access_token=${page.accessToken}`
    );
    res.push(ad.data);
  }
  return res;
};

export const publishInstagramPost = async (
  socialAccounts: SocialMediaAccount[],
  description: string,
  imageUrl: string
) => {
  const res = [];
  for (const socialAccount of socialAccounts) {
    const container = await axios.post(
      `https://graph.facebook.com/v15.0/${socialAccount.id}/media?image_url=${imageUrl}&caption=${description}&access_token=${socialAccount.accessToken}`
    );
    const ad = await axios.post(
      `https://graph.facebook.com/v15.0/${socialAccount.id}/media_publish?creation_id=${container.data.id}&access_token=${socialAccount.accessToken}`
    );
    res.push(ad.data);
  }
  return res;
};

export const publishTwitterTweet = async (tweet) => {
  try {
    const fs = require("fs");
    const filePath = "user.txt"; // Path to the file
    const consumerKey = process.env["TWITTER_CONSUMER_KEY"];
    const consumerSecret = process.env["TWITTER_CONSUMER_SECRET"];
    const data = await fs.readFileSync(filePath, "utf8");
    let user = JSON.parse(data);

    const config = {
      method: "post",
      url: "https://api.twitter.com/2/tweets",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth oauth_consumer_key="${consumerKey}",oauth_token="${user.token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1685906318",oauth_nonce="f6fQGexsCGm",oauth_version="1.0",oauth_signature="304dYTDGcHjSCcl2%2BvA65NyTRUM%3D"`,
        Cookie: "guest_id=v1%3A168469789617468820",
      },
      data: JSON.stringify({ text: tweet }),
    };
    const result = await axios.request(config);
    console.log("twitter req res", result.data);
    return result.data;
  } catch (error) {
    console.log("twitter req error", error);
  }
};

export const deleteTwitterTweet = async (tweetId) => {
  try {
    const fs = require("fs");
    const filePath = "user.txt"; // Path to the file
    const consumerKey = process.env["TWITTER_CONSUMER_KEY"];
    const consumerSecret = process.env["TWITTER_CONSUMER_SECRET"];

    const data = await fs.readFileSync(filePath, "utf8");
    let user = JSON.parse(data);

    const oauth = OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha1", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const token = {
      key: user.token,
      secret: user.tokenSecret,
    };

    const headers = oauth.toHeader(
      oauth.authorize(
        {
          url: `https://api.twitter.com/2/tweets/${tweetId}`,
          method: "DELETE",
        },
        token
      )
    );

    const result = await axios.delete(
      `https://api.twitter.com/2/tweets/${tweetId}`,
      {
        headers: headers,
      }
    );

    // @ts-ignore
    console.log("tweet delete res", result);
    // @ts-ignore
    return result.data;
  } catch (error) {
    console.log("tweet delete error", error);
  }
};

export const findAll = async (userId: string) => {
  const res = [];
  const allAds = await AdvertisementRepository.findAll(userId);
  for (const ad of allAds) {
    if (ad.sourceType === AdvertisementType.PAGE) {
      const page = await PagesRepository.findByPagePlatformId(ad.sourceId);
      res.push({
        ...ad,
        page,
      });
    } else if (ad.sourceType === AdvertisementType.ACCOUNT) {
      const page = await SocialMediaAcouuntService.get(ad.sourceId);
      res.push({
        ...ad,
        page,
      });
    } else if (ad.sourceType === AdvertisementType.TWITTER) {
      try {
        const fs = require("fs");
        const filePath = "user.txt"; // Path to the file
        const data = await fs.readFileSync(filePath, "utf8");
        let user = JSON.parse(data);
        res.push({
          ...ad,
          page: { name: user.profile.displayName },
        });
      } catch (error) {
        res.push({
          ...ad,
          page: { name: "" },
        });
      }
    }
  }
  return res;
};
