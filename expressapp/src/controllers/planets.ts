import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../server.js";

type Planet = {
  id: number;
  name: string;
};

export type Planets = Planet[];

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

export const validatePlanet = (data: any): Joi.ValidationResult => {
  return planetSchema.validate(data);
};

export const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
};

export const getOneById = async (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const planet = await db.many(`SELECT * FROM planets WHERE id=$1;`, planetId);

  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }

  res.status(200).json(planet);
};
export const create = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    await db.none("INSERT INTO planets (name) VALUES ($1)", name);
    res.status(201).json({ msg: "Planet created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateById = async (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);
  const { name } = req.body;

  try {
    await db.none("UPDATE planets SET name = $1 WHERE id = $2", [
      name,
      planetId,
    ]);
    res.status(200).json({ msg: "Planet updated successfully" });
  } catch (error) {
    res.status(404).json({ error: "Planet not found" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);

  try {
    await db.none("DELETE FROM planets WHERE id = $1", planetId);
    res.status(200).json({ msg: "Planet deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Planet not found" });
  }
};

export const updateImageById = async (req: Request, res: Response) => {
  const planetId = parseInt(req.params.id, 10);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file?.path;

  try {
    await db.none("UPDATE planets SET image = $1 WHERE id = $2", [
      imagePath,
      planetId,
    ]);
    res.status(200).json({ msg: "Planet image updated successfully" });
  } catch (error) {
    res.status(404).json({ error: "Planet not found" });
  }
};