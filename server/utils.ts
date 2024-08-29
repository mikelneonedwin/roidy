import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: import("express").ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(chalk.red(err));
    res.status(err.status || 500);
    res.json({ error: err.message || "Internal Server Error" })
}