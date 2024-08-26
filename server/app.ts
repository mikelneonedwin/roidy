import express from "express";
import { resolve } from "path";
import api from "./api"
import chalk from "chalk"
import { errorHandler } from "./utils";

const app: import("express").Express = express();

app.use(api);
// serve build
const staticPath = resolve("dist")
app.use(express.static(staticPath));
// catch all route
app.use((_req, res) => {
    res.sendFile(resolve(staticPath, "index.html"))
})
app.use(errorHandler)

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
})

export default app;