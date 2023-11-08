import { AdvertisementType } from "./../utils/types";
import { Request, Response } from "express";
import { AdvertisementService } from "../services/index";
import AdvertisementDTO from "../models/advertisement.dto";
import updateAdvertisementDTO from "../models/updateAdvertiesment.dto";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";

export const get = async (req: Request, res: Response) => {
  try {
    const { advertiesmentId } = req.query;
    const result = await AdvertisementService.get(advertiesmentId as string);
    res.send(
      new CustomResponse(
        ResponseStatus.OK,
        "Advertiesment get Successfully.",
        result
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "Error get Advertiemsnt",
        error
      )
    );
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.currUser.userId;
    const result = await AdvertisementService.create(
      req.body as AdvertisementDTO,
      userId
    );
    res.send(
      new CustomResponse(
        ResponseStatus.RESOURCE_CREATED,
        "Create Advertiesmemt Successfully",
        result
      )
    );
  } catch (error) {
    new CustomResponse(
      ResponseStatus.BAD_REQUEST,
      "Error Cretae Advertiemsnt",
      error
    );
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { advertiesmentId } = req.query;
    const result = await AdvertisementService.update(
      advertiesmentId as string,
      req.body as updateAdvertisementDTO
    );
    res.send(
      new CustomResponse(
        ResponseStatus.OK,
        "Update Advertiemsnt Success",
        result
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "Error Update Advertiesment",
        error
      )
    );
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { adId, adDbId, sourceId, sourceType } = req.query;
    console.log("query: ", req.query);
    const result = await AdvertisementService.remove(
      adId as string,
      adDbId as string,
      sourceId as string,
      sourceType as AdvertisementType
    );
    res.send(
      new CustomResponse(
        ResponseStatus.OK,
        "Removed Advertiesment Success",
        result
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "Error Reomved Advertiesment",
        error
      )
    );
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const { userId } = req.currUser;
    const result = await AdvertisementService.findAll(userId as string);
    res.send(
      new CustomResponse(ResponseStatus.OK, "get all Advertisment", result)
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error get all advertisment",
        error
      )
    );
  }
};
