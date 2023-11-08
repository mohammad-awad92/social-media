import { Router } from "express";
import { AdvertiesmentController } from "../controllers/index";
import Validator from "../utils/requestValidator";
import authenticationMiddleware from "../middleware/auth";
import AdvertisementDTO from "../models/advertisement.dto";
import updateAdvertisementDTO from "../models/updateAdvertiesment.dto";

const router: Router = Router();

router.get("/get", authenticationMiddleware, AdvertiesmentController.get);
router.post(
  "/create",
  authenticationMiddleware,
  Validator(AdvertisementDTO),
  AdvertiesmentController.create
);
router.put(
  "/update",
  authenticationMiddleware,
  Validator(updateAdvertisementDTO),
  AdvertiesmentController.update
);
router.delete(
  "/delete",
  authenticationMiddleware,
  AdvertiesmentController.remove
);
router.get("/all", authenticationMiddleware, AdvertiesmentController.findAll);

export default router;
