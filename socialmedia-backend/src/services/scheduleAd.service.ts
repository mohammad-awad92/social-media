import {
  publishFacebookPost,
  publishInstagramPost,
} from "./advertiesment.service";
import { ScheduleAdDto } from "../models/ScheduleAd.dto";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import { AdvertisementService } from "../services/index";
import ScheduleRepository from "../repositories/ScheduleAd";
import Schedule from "../entities/ScheduleAd";
import AdvertisementDTO from "models/advertisement.dto";
const cron = require("node-cron");

export const get = async (sceduleId: string): Promise<Schedule> => {
  const schedule: Schedule = await ScheduleRepository.findById(sceduleId);
  if (!schedule)
    throw new CustomResponse(ResponseStatus.BAD_REQUEST, "Schedule not found!");
  return schedule;
};

export const create = async (
  scheduleAdDto: ScheduleAdDto & AdvertisementDTO,
  userId: string
): Promise<Schedule[]> => {
  const advertisements = await AdvertisementService.create(
    scheduleAdDto as AdvertisementDTO,
    userId
  );
  const res = [];
  for (const advertisement of advertisements) {
    const schedule: Schedule = { ...scheduleAdDto, advertisement };
    const scheduledAd = await ScheduleRepository.save({ ...schedule });
    res.push(scheduledAd);
  }
  let date = new Date(scheduleAdDto.time_date);
  let formattedDate = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } ${date.getDay()}`;
  cron.schedule(formattedDate, () => {
    publishFacebookPost(scheduleAdDto.pages, scheduleAdDto.Description_AD);
    publishInstagramPost(
      scheduleAdDto.socialAccounts,
      scheduleAdDto.Description_AD,
      scheduleAdDto.img
    );
  });
  return res;
};

export const remove = async (scheduleId: string) => {
  const schedule: Schedule = await get(scheduleId);
  return await ScheduleRepository.softDelete(schedule?.id);
};

export const removeAdver = async (scheduleId: string) => {
  const schedule: Schedule = await get(scheduleId);
  // const adver = await AdvertisementService.remove(schedule?.advertisement?.id);
  return await ScheduleRepository.softDelete(schedule?.id);
};

export const findAll = async () => {
  return await ScheduleRepository.findAll();
};
