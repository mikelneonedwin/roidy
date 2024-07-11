import chalk from "chalk"

export function error(msg: string, exit: boolean = true) {
    console.log(chalk.bgRed.white.bold(" ERROR ") + " " + msg)
    if (exit) return process.exit(1)
}

export function warn(msg: string) {
    return console.warn(chalk.bgYellow.black.bold(" WARN ") + " " + msg)
}

export function info(msg: string) {
    return console.info(chalk.bgCyan.white.bold(" INFO ") + " " + msg)
}

export function dim(msg: string) {
    return console.log(chalk.white.dim(msg))
}

export { default as downloadFile } from "./downloadFile.js"
export { default as exec } from "./exec.js"
export { default as spinner } from "./spinner.js"
