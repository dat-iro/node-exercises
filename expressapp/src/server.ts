import express from "express";
import dotenv from "dotenv";
import * as planetController from "./controllers/planets.js";
import pgPromise from "pg-promise";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

dotenv.config();

export const db = pgPromise()(
  "postgres://postgres:Matteo291199@localhost:5432/esercizio"
);

const setupDb = async () => {
  await db.none(`
      DROP TABLE IF EXISTS planets;

      CREATE TABLE planets(
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT
      );

      DROP TABLE IF EXISTS users;

      CREATE TABLE users(
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        key TEXT
      );
    `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth'), ('Mars');`);
  await db.none(
    `INSERT INTO users (username, password) VALUES ('dummy', 'dummy');`
  );
};

setupDb();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.json());

app.get("/api/planets/", planetController.getAll);
app.get("/api/planets/:id", planetController.getOneById);
app.post("/api/planets/", planetController.create);
app.put("/api/planets/:id", planetController.updateById);
app.delete("/api/planets/:id", planetController.deleteById);
app.post(
  "/api/planets/:id/image",
  upload.single("image"),
  planetController.updateImageById
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});