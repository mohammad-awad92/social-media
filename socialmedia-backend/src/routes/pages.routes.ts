import { Router } from "express";
import { PagesController } from "../controllers/index";
import Validator from "../utils/requestValidator";
import authenticationMiddleware from "../middleware/auth";
// import PageDto from "../models/page.dto";

const router: Router = Router();

router.get("/", authenticationMiddleware, PagesController.getUserPages);
// router.get("/get_page", authenticationMiddleware, PagesController.get);
// router.put(
//   "/",
//   authenticationMiddleware,
//   Validator(PageDto),
//   PagesController.update
// );

export default router;
