import chalk from "chalk"

export function error(msg: string) {
    console.log(chalk.bgRed.white.bold(" ERROR ") + " " + msg)
    process.exit(1)
}

export const warn = (msg: string) => console.warn(chalk.bgYellow.black.bold(" WARN ") + " " + msg)

export const info = (msg: string) => console.info(chalk.bgCyan.black.bold(" INFO ") + " " + msg)

export const dim = (msg: string) => console.log(chalk.white.dim(msg))

export { default as downloadFile } from "./downloadFile.js"
export { default as exec } from "./exec.js"