import chalk from "chalk"

export function error(err: Error) {
    if (process.env.NODE_ENV !== "production") console.error(err)
    console.error(
        chalk.bgRed.white.bold(" ERROR ") +
        ` ${err.message}`
    )
}

export const warn = (msg: string) =>
    console.warn(
        chalk
            .bgYellow
            .white
            .bold(" WARN ") +
        ` ${msg}`
    )

export const info = (msg: string) =>
    console.info(
        chalk
            .bgCyan
            .white
            .bold(" INFO ") +
        ` ${msg}`
    )

export const dim = (msg: string) => console.log(chalk.white.dim(msg))

export const ip_pattern = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"