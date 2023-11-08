import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { plainToClass } from "class-transformer";

const Validator = (Dto: any) => {
  return async (req: Request, res: Response, next) => {
    try {
      const body = plainToClass(Dto, req.body);
      await validateOrReject(body);
      next();
    } catch (e) {
      return res.status(400).send(e.map((error) => error.constraints));
    }
  };
};
export default Validator;
