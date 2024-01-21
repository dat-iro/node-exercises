import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import Joi from "joi";

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

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

// Middleware for validating planet data
const validatePlanet = (req: Request, res: Response, next: NextFunction) => {
  const { error } = planetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

app.get("/api/planets", (req: Request, res: Response) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }

  res.status(200).json(planet);
});

app.post("/api/planets", validatePlanet, (req: Request, res: Response) => {
  const newPlanet: Planet = {
    id: planets.length + 1,
    name: req.body.name,
  };

  planets.push(newPlanet);
  res.status(201).json({ msg: "Planet created successfully" });
});

app.put("/api/planets/:id", validatePlanet, (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planetIndex = planets.findIndex((p) => p.id === planetId);

  if (planetIndex === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }

  planets[planetIndex].name = req.body.name;
  res.status(200).json({ msg: "Planet updated successfully" });
});

app.delete("/api/planets/:id", (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planetIndex = planets.findIndex((p) => p.id === planetId);

  if (planetIndex === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }

  planets.splice(planetIndex, 1);
  res.status(200).json({ msg: "Planet deleted successfully" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});