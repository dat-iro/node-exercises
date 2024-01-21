import express from "express";
import dotenv from "dotenv";
import * as planetController from "./controllers/planets.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.json());

app.get("/api/planets/", planetController.getAll);
app.get("/api/planets/:id", planetController.getOneById);
app.post("/api/planets/", planetController.create);
app.put("/api/planets/:id", planetController.updateById);
app.delete("/api/planets/:id", planetController.deleteById);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});