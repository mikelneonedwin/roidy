import chalk from "chalk"

export function error(err: string | Error) {
    const log = chalk.red.bold("[ERROR]");
    const msg = err instanceof Error
        ? err.message
        : err
    console.error(`${log} ${msg}`)
    return err instanceof Error &&
        process.env.NODE_ENV !== "production" &&
        console.error(err)
}

export const warn = (msg: string) => console.warn(chalk.yellow.bold("[WARN]"), msg)

export const info = (msg: string) => console.info(chalk.cyan.bold("[INFO]"), msg)

export const dim = (msg: string) => console.log(chalk.white.dim(msg))

export const ip_pattern = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"