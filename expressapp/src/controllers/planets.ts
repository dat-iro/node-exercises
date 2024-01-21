import { Request, Response } from "express";
import Joi from "joi";

type Planet = {
  id: number;
  name: string;
};

export type Planets = Planet[];

export let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

export const validatePlanet = (data: any): Joi.ValidationResult => {
  return planetSchema.validate(data);
};

export const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

export const getOneById = (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }

  res.status(200).json(planet);
};

export const create = (req: Request, res: Response) => {
  const { error } = validatePlanet(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newPlanet: Planet = {
    id: planets.length + 1,
    name: req.body.name,
  };

  planets.push(newPlanet);
  res.status(201).json({ msg: "Planet created successfully" });
};

export const updateById = (req: Request, res: Response) => {
  const { error } = validatePlanet(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const planetId = parseInt(req.params.id, 10);
  const planetIndex = planets.findIndex((p) => p.id === planetId);

  if (planetIndex === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }

  planets[planetIndex].name = req.body.name;
  res.status(200).json({ msg: "Planet updated successfully" });
};

export const deleteById = (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planetIndex = planets.findIndex((p) => p.id === planetId);

  if (planetIndex === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }

  planets.splice(planetIndex, 1);
  res.status(200).json({ msg: "Planet deleted successfully" });
};