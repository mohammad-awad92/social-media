import { Router } from 'express';
import { ScheduleAdController } from "../controllers/index";
import { ScheduleAdDto } from '../models/ScheduleAd.dto';
import Validator from '../utils/requestValidator';
import authenticationMiddleware from '../middleware/auth';

const router: Router = Router();

router.get("/", authenticationMiddleware, ScheduleAdController.get);
router.post("/", authenticationMiddleware, Validator(ScheduleAdDto), ScheduleAdController.create);
router.delete("/", authenticationMiddleware, ScheduleAdController.remove);
router.delete("/ad", authenticationMiddleware, ScheduleAdController.removeAdver);
router.get("/all", authenticationMiddleware, ScheduleAdController.findAll);

export default router;