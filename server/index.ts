import express from "express";
import { resolve } from "path";
import api from "./api.js";

const app: import("express").Express = express();

app.use(express.static(resolve("dist", "web")));

app.use("/api", api)

app.use((_req, res) => res.sendFile(resolve("web", "index.html")));

const errorHandler: import("express").ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal Server Error"
    })
}
app.use(errorHandler)

export default app;