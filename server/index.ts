import express from "express";
import { resolve } from "path";
import api from "./api"
import chalk from "chalk"
import ViteExpress from "vite-express"

const app: import("express").Express = express();

// api
app.use(api);

if (process.env.NODE_ENV === "production") {
    // serve build
    const staticPath = resolve("dist")
    app.use(express.static(staticPath));

    // catch all route
    app.use((_req, res) => {
        res.sendFile(resolve(staticPath, "index.html"))
    })
} else {
    const port = process.env.PORT || 3000;
    ViteExpress.listen(app, Number(port), () => {
        console.log(chalk.green("Server listening on port 3000"));
    })
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: import("express").ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(chalk.red(err));
    res.status(err.status || 500);
    res.json({ error: err.message || "Internal Server Error" })
}
app.use(errorHandler)

export default app;