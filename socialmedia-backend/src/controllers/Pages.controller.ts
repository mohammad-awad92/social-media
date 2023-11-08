import { Request, Response } from "express";
// import PageDto from "../models/page.dto";
import { PagesService } from "../services/index";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";

// export const get = async (req: Request, res: Response) => {
//   try {
//     const { pageId } = req.query;
//     const result = await PagesService.get(pageId as string);
//     res.send(new CustomResponse(ResponseStatus.OK, "get info page", result));
//   } catch (error) {
//     res.send(
//       new CustomResponse(
//         ResponseStatus.BAD_REQUEST,
//         "error get page",
//         error.message
//       )
//     );
//   }
// };

export const getUserPages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.currUser;
    const result = await PagesService.getUserPages(userId as string);
    res.send(new CustomResponse(ResponseStatus.OK, "get Pages", result));
  } catch (error) {
    console.log("error", error);
    res.send(
      new CustomResponse(
        ResponseStatus.BAD_REQUEST,
        "Error get Pages",
        {},
        error
      )
    );
  }
};

// export const update = async (req: Request, res: Response) => {
//   try {
//     const { pageId } = req.query;
//     const result = await PagesService.update(
//       pageId as string,
//       req.body as PageDto
//     );
//     res.send(new CustomResponse(ResponseStatus.OK, "updated", result));
//   } catch (error) {
//     res.send(
//       new CustomResponse(ResponseStatus.BAD_REQUEST, "eror", error.message)
//     );
//   }
// };
