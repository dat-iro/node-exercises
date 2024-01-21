import { Request, Response } from "express";
import { db } from "../server.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { SECRET = "" } = process.env;

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    "SELECT* FROM users WHERE username=$1;",
    username
  );

  if (user) {
    res.status(409).json({ error: "Username Exists!" });
  } else {
    const { id } = await db.one(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, password]
    );
    res.status(201).json({ id, msg: "User Cretated!" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    "SELECT* FROM users WHERE username=$1;",
    username
  );

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };

    const token = jwt.sign(payload, SECRET);

    await db.none("UPDATE users SET KEY = $1 WHERE id=$2", [token, user.id]);

    res.status(201).json({ id: user.id, username, token });
  } else {
    res.status(400).json({ error: "Username or password incorrect!" });
  }
};

export const logOut = async (req: Request, res: Response) => {
  const user: any = req.user;

  console.log(user);

  await db.none(`UPDATE users SET key=NULL WHERE id=$1;`, user?.id);

  res.status(200).json("Logged Out!");
};