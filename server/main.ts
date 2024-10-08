import chalk from "chalk";
import express from "express";
import { resolve } from "path";
import { exec, info } from "../cmd/utils";
import api from "./api";
import { errorHandler, getPort } from "./utils";

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

export default function server(port?: number) {
    port = getPort(port);
    app.listen(port, () => {
        info(`Server listening on port ${chalk.cyan(port)}`)
        const url = `http://localhost:${port}`
        console.log(`Visit ${chalk.cyan(url)} in your browser`)
        // auto open browser
        exec({
            default: `xdg-open ${url}`,
            mac: `open ${url}`,
            win: `start ${url}`
        })
    })
}