import chalk from "chalk";
import express from "express";
import ViteExpress from "vite-express";
import { info } from "../cmd/utils";
import api from "./api";
import { errorHandler, getPort } from "./utils";

const app: import("express").Express = express();

app.use(api);
app.use(errorHandler)

const port = getPort();
const server = ViteExpress.listen(app, port, () => {
    info(`Server listening on port ${chalk.cyan(port)}`)
})
process.on("exit", () => server.close())