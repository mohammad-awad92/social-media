import { Request, Response } from "express";
import { AuthService, UserService } from "../services/index";
import UserDto from "../models/user.dto";
import loginDto from "../models/login.dto";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import UpdateUserDto from "../models/update.dto";

export const login = async (req: Request, res: Response) => {
  const { email, password }: loginDto = req.body;
  const result = await AuthService.login(email, password);
  res.send(new CustomResponse(ResponseStatus.OK, "Login Succssfully.", result));
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signUp(req.body as UserDto);
    res.send(
      new CustomResponse(
        ResponseStatus.RESOURCE_CREATED,
        "Sign Up Successfully.",
        result
      )
    );
  } catch (error) {
    res.send(
      new CustomResponse(ResponseStatus.BAD_REQUEST, "Error Sign Up", error)
    );
  }
};

export const get = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await UserService.get(userId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "Get User", result));
  } catch (error) {
    res.send(
      new CustomResponse(ResponseStatus.BAD_REQUEST, "Error get User", error)
    );
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await UserService.update(
      userId as string,
      req.body as UpdateUserDto
    );
    res.send(
      new CustomResponse(ResponseStatus.OK, "Updated Successfully", result)
    );
  } catch (error) {
    res.send(
      new CustomResponse(ResponseStatus.BAD_REQUEST, "Error Update User", error)
    );
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await UserService.remove(userId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "Removed", result));
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "Error Rmoved",
        null,
        JSON.stringify(error)
      )
    );
  }
};

// export const logout = async(req: Request, res: Response) => {
//   const log = req.currUser.data.token;
//   const { userId } = req.query;
//   console.log("token", log);

//   if(userId) {

//   }
// };
export const ConfirmationEmial = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (token) {
      const result = await AuthService.ConfirmationEmial(token);
      const { userId } = result;
      await UserService.update(userId, { is_Verify: true });
      res.send(
        new CustomResponse(ResponseStatus.OK, "Sucsses Active Account", result)
      );
    }
  } catch (error) {
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "ERROR IN ACTIVE ACCOUNT",
        error
      )
    );
  }
};
