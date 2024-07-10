import express from "express";
import ViteExpress from "vite-express";
import api from "./api.js"

const app = express();

app.use("/api", api)

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
