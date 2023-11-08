import { Router } from "express";
import { AuthController } from "../controllers/index";
import Validator from "../utils/requestValidator";
import UserDto from "../models/user.dto";
import loginDto from "../models/login.dto";
import authenticationMiddleware from "../middleware/auth";
import UpdateUserDto from "../models/update.dto";

const router: Router = Router();

router.post("/login", Validator(loginDto), AuthController.login);
router.post("/signUp", Validator(UserDto), AuthController.signUp);
router.get("/verifay/:token", AuthController.ConfirmationEmial);
// router.post("/logout", AuthController.logout);
router.get("/get-user", authenticationMiddleware, AuthController.get);
router.put(
  "/update-user",
  authenticationMiddleware,
  Validator(UpdateUserDto),
  AuthController.update
);
router.delete("/delete-user", authenticationMiddleware, AuthController.remove);

export default router;
