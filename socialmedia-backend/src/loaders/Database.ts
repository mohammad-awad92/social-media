import "reflect-metadata";
import { createConnection } from "typeorm";
import logger from "../utils/logger";

export default async (args = {}) => {
  logger.log("Connecting to DB");
  await createConnection();
  logger.log("DB is Ready");
};
