import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: Error | null, user: any) => {
      if (!user || err) {
        res.status(401).json("Unauthorized!");
      } else {
        req.user = user;
        next();
      }
    }
  )(req, res, next);
};