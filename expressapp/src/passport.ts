import dotenv from "dotenv";
import passport from "passport";
import passportJWT from "passport-jwt";
import { db } from "./server.js";

dotenv.config();

const { SECRET } = process.env;

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      const users = await db.one(`SELECT * FROM users WHERE id=$1`, payload.id);

      try {
        return users ? done(null, users) : new Error("User not found.");
      } catch (error) {
        done(error);
      }
    }
  )
);