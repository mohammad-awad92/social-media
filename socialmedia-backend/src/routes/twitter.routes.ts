import { Router } from "express";
import * as passport from "passport";
import * as TwitterStrategy from "passport-twitter";

const writeUser = (user) => {
  const fs = require("fs");
  const filePath = "user.txt"; // Path to the file

  fs.writeFile(filePath, user, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Successfully wrote to file:", filePath);
    }
  });
};

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env["TWITTER_CONSUMER_KEY"],
      consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
      callbackURL: "/twitter/callback",
    },
    function verify(token, tokenSecret, profile, cb) {
      console.log("profile", { token, tokenSecret, profile, cb });
      writeUser(
        JSON.stringify({
          token: token,
          tokenSecret: tokenSecret,
          profile: profile,
        })
      );
      cb(null, { token, tokenSecret, profile, cb });
    }
  )
);

passport.serializeUser(function (user, cb) {
  const sessionData = {
    token: user.token,
    tokenSecret: user.tokenSecret,
    profile: user.profile,
  };
  cb(null, sessionData);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

const twitterRouter: Router = Router();

twitterRouter.get("/twitter/auth", passport.authenticate("twitter"));

twitterRouter.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successReturnToOrRedirect:
      "http://localhost:3000/admin/accounts?external=true",
    failureRedirect: "http://localhost:3000/admin/accounts?external=true",
  })
);

export { twitterRouter };
