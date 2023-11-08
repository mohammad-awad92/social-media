import { Router } from "express";
import AuthUser from "./auth.routes";
import SocialMediaAccount from "./social_media_account.routes";
import Advertiesment from "./advertiesment.routes";
import PagesRouter from "./pages.routes";
import ScheduleRouter from "./scheduleAd.routes";
import { UploadController } from "../controllers";

const router: Router = Router();

router.use("/auth-user", AuthUser);
router.use("/social-account", SocialMediaAccount);
router.use("/advertiesment", Advertiesment);
router.use("/pages", PagesRouter);
router.use("/schedule", ScheduleRouter);
router.post("/upload", UploadController.upload);

export { router };
