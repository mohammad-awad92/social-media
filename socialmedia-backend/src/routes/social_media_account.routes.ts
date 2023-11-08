import { Router } from "express";
import authenticationMiddleware from "../middleware/auth";
import { SocialMediaAccountController } from "../controllers";

const router: Router = Router();

router.get(
  "/",
  authenticationMiddleware,
  SocialMediaAccountController.getSocialMediaAccount
);
router.post(
  "/register",
  authenticationMiddleware,
  SocialMediaAccountController.registerSocialAccount
);

export default router;
