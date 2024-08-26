import chalk from "chalk"
import { Spinner } from "cli-spinner"
import { build } from "esbuild"

const spinner = new Spinner({
    text: chalk.cyan("Bundling CLI Script"),
    stream: process.stdout,
    onTick(msg) {
        this.clearLine(this.stream)
        this.stream.write(msg)
    }
})
spinner.setSpinnerString(18).start()

const outfile = "dist/server.cjs"

build({
    entryPoints: ["server/app.ts"],
    platform: "node",
    target: "node18",
    bundle: true,
    outfile,
    minify: true,
    sourcemap: false
})
    .then(() => {
        spinner.stop(true)
        console.log(chalk.green(`Bundled CLI to ${outfile}`))
    })
    .catch((err) => {
        spinner.stop(true)
        console.error(chalk.red("Error: " + err.message))
    })