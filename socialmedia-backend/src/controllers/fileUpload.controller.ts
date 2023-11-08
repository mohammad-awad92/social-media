import { Request, Response } from "express";
import * as path from "path";
const multer = require("multer");

const maxSize = 1 * 1000 * 1000;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

let multerUpload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    let filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },
  // mypic is the name of file attribute
}).single("image");

export const upload = async (req: Request, res: Response) => {
  try {
    multerUpload(req, res, function (err) {
      if (err) {
        // ERROR occurred (here it can be occurred due
        // to uploading image of size greater than
        // 1MB or uploading different file type)
        res.send(err);
      } else {
        console.log("res", res);
        // SUCCESS, image successfully uploaded
        res.send("Success, Image uploaded!");
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};
