import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.send(planets);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});