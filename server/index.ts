import chalk from "chalk";
import express from "express";
import ViteExpress from "vite-express";
import api from "./api";
import { errorHandler } from "./utils";

const app: import("express").Express = express();

app.use(api);
app.use(errorHandler)

const port = Number(process.env.PORT) || 3000;
ViteExpress.listen(app, port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
})