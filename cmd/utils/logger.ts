import chalk from "chalk"

export function error(msg: string, exit?: boolean) {
    console.log(chalk.bgRed.white.bold(" ERROR ") + " " + msg)
    if (exit) return process.exit(1)
}

export function warn(msg: string) {
    return console.warn(chalk.bgYellow.white.bold(" WARN ") + " " + msg)
}

export function info(msg: string) {
    return console.info(chalk.bgCyan.white.bold(" INFO ") + " " + msg)
}

export function dim(msg: string) {
    return console.log(chalk.white.dim(msg))
}