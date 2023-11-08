import { Request, Response, NextFunction } from "express";

export default function checkRoleMiddleware(roles: string[]) {
 return async (req: Request, res: Response, next: NextFunction) => {
  const { currUser } = req;
  if(roles.indexOf(currUser.type) > -1) next();
  else res.sendStatus(401);
 };
};