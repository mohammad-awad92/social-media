import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import config from "../config";
import logger from "../utils/logger";
import * as passport from "passport";
import * as csrf from "csurf";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";

export default class ExpressLoader {
  static start = () => {
    const app = express();
    const { router } = require("../routes");
    const { twitterRouter } = require("../routes/twitter.routes");
    // Setup error handling, this must be after all other middleware
    app.use(ExpressLoader.errorHandler);
    // Serve static content
    app.use(express.static(path.join(__dirname, "uploads")));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Pass app to routes
    app.use(cookieParser());
    app.use(
      session({
        secret: "keyboard cat",
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
      })
    );
    app.use(router);
    // Set up middleware
    app.use(csrf({ cookie: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate("session"));
    app.use(function (req, res, next) {
      // @ts-ignore
      var msgs = req.session.messages || [];
      res.locals.messages = msgs;
      res.locals.hasMessages = !!msgs.length;
      // @ts-ignore
      req.session.messages = [];
      next();
    });
    app.use(function (req, res, next) {
      // @ts-ignore
      // res.locals.csrfToken = req.csrfToken?.();
      next();
    });

    app.use(twitterRouter);

    // Start application
    app.listen(config.port, () => {
      logger.log(`Express running, now listening on port ${config.port}`);
    });
  };

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler(error, req, res, next) {
    let parsedError;

    // Attempt to gracefully parse error object
    try {
      if (error && typeof error === "object") {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.log(e);
    }

    // Log the original error
    logger.log(parsedError);

    // If response is already sent, don't attempt to respond to client
    if (res.headersSent) {
      return next(error);
    }

    res.status(400).json({
      success: false,
      error,
    });
  }
}
