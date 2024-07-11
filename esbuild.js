import { build } from "esbuild"
import { Spinner } from "cli-spinner"
import chalk from "chalk"

const spinner = new Spinner({
    text: chalk.cyan("Bundling CLI script"),
    stream: process.stdout,
    onTick(msg) {
        this.clearLine(this.stream)
        this.stream.write(msg)
    }
})
spinner.setSpinnerString(18).start()

const outfile = "dist/index.cjs"

build({
    // minify: true,
    entryPoints: ["cli/index.ts"],
    platform: "node",
    target: "node18",
    bundle: true,
    outfile,
    minify: true,
    sourcemap: false,
    alias: {
        "@": ".",
    }
})
    .then(() => {
        spinner.stop(true)
        console.log(chalk.green(`Bundled CLI to ${outfile}`))
    })
    .catch((err) => {
        spinner.stop(true)
        console.error(chalk.red("Error: " + err.message))
    })