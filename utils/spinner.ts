import chalk from "chalk"
import { Spinner as Spinnerx } from "cli-spinner"
import { error, info, warn } from "./index.js"

class Spinner {
    private spinner: import("cli-spinner").Spinner

    constructor(text: string) {
        this.spinner = new Spinnerx({
            text,
            stream: process.stdout,
            onTick(msg: string) {
                this.clearLine(this.stream)
                this.stream.write(msg)
            }
        })
    }

    start(msg?: string) {
        msg
            ? this.spinner.setSpinnerTitle(msg)
            : this.spinner.start()
        return this
    }

    /**
     * Persists an `info` message to the screen after stopping the spinner
     */
    info(msg: string) {
        this.spinner.stop(true)
        info(msg)
    }

    /**
     * Persists an `error` message to the screen after stopping the spinner
     */
    fail(text: string) {
        this.spinner.stop(true)
        error(text, false)
    }

    /**
     * Persists an `warning` message to the screen after stopping the spinner
    */
    warn(text: string) {
        this.spinner.stop(true)
        warn(text)
    }

    /**
     * Persist a `success` message to the screen after stopping the spinner
     */
    succeed(text: string) {
        this.spinner.stop(true)
        console.log(chalk.green(text))
    }
}

/**
 * Display a loading message to the console
 */
export default function spinner(text: string) {
    return new Spinner(text)
}