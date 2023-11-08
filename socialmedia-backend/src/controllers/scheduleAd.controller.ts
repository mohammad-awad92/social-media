import { Request, Response } from "express";
import { ScheduleAdService } from "../services/index";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import { ScheduleAdDto } from "../models/ScheduleAd.dto";
import AdvertisementDTO from "models/advertisement.dto";

export const get = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.query;
    const result = await ScheduleAdService.get(scheduleId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "get scedule", result));
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error get schedule",
        error.message
      )
    );
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.currUser.userId;
    const result = await ScheduleAdService.create(
      req.body as ScheduleAdDto & AdvertisementDTO,
      userId
    );
    res.send(
      new CustomResponse(
        ResponseStatus.OK,
        "create Schedule Suuccessfully",
        result
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error create Schedule",
        error
      )
    );
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.query;
    const result = await ScheduleAdService.remove(scheduleId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "Remove Suucess", result));
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error remove Schedule",
        error.message
      )
    );
  }
};

export const removeAdver = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.query;
    const result = await ScheduleAdService.removeAdver(scheduleId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "Remove Suucess", result));
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error remove Schedule",
        error.message
      )
    );
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const result = await ScheduleAdService.findAll();
    res.send(new CustomResponse(ResponseStatus.OK, "get all schedule", result));
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "error get all schedule",
        error.message
      )
    );
  }
};
