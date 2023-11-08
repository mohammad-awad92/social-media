import CustomResponse, { ResponseStatus } from "./../utils/customResponse";
import { Request, Response } from "express";
import SocialMediaAccontDto from "../models/socialMediaAccount.dto";
import { SocialMediaAcouuntService } from "../services";

export const registerSocialAccount = async (req: Request, res: Response) => {
  try {
    const socialAccount =
      await SocialMediaAcouuntService.createSocialMediaAccount(
        req.currUser.userId,
        req.body as SocialMediaAccontDto
      );
    res.send(
      new CustomResponse(
        ResponseStatus.OK,
        "Create Social Account",
        socialAccount
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error create social account",
        {},
        error
      )
    );
  }
};

export const getSocialMediaAccount = async (req: Request, res: Response) => {
  try {
    const socialAccount = await SocialMediaAcouuntService.getByUserId(
      req.currUser.userId
    );
    res.send(
      new CustomResponse(ResponseStatus.OK, "Get Social Account", socialAccount)
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error get social account",
        {},
        error
      )
    );
  }
};
