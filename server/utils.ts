import chalk from "chalk";
import { error, exec } from "../cmd/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: import("express").ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(chalk.red(err));
    res.status(err.status || 500);
    res.json({ error: err.message || "Internal Server Error" })
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function handle(callback: Function, res: ExpressResponse) {
    try {
        res.json(callback());
        // @ts-expect-error ...
    } catch (err: Error) {
        error(err)
        res.status(500)
        res.send(err.message.replace("adb.exe: ", ""))
    }
}


export function getPort(port?: number) {
    const port_data = exec({
        default: "lsof -i",
        win: "netstat -a"
    })

    if (port_data.error) {
        console.error(port_data.stderr)
        error(new Error("Unable to start server"))
        process.exit()
    }

    const port_set = new Set(port_data.stdout.match(/:\d+/g));
    const list = Array
        .from(port_set)
        .map((port) => +port.slice(1));

    port = +(
        port ||
        process.env.PORT ||
        3000
    )

    while (list.includes(port)) port++;

    return port;
}