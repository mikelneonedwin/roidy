// @ts-check

import chalk from "chalk"
import { exec as execs } from "child_process"
import { readFileSync, readdirSync, writeFileSync } from "fs"
import { platform } from "os"
import { join, sep } from "path"
import { promisify } from "util"

/**  
 * List of targets to create binaries for
 * @type {typeof import("./builds.json")} 
 */
const targets = JSON.parse(readFileSync("builds.json", "utf-8"))

let binariesBuilt = 0;

// display build progress on console
function logProgress() {
    binariesBuilt++;
    const progress = binariesBuilt / targets.length * 100
    process.stdout.write(
        "\rCreating executables" +
        `\t${progress}%\t` +
        chalk.yellow(binariesBuilt) +
        " of "
        + chalk.yellow(targets.length)
    )
    if (progress === 100) console.log()
}

console.log(
    `Starting creation of ${targets.length} executable%s`,
    targets.length == 1 ? "" : "s"
)

// create builds
const exec = promisify(execs);
const data = await Promise.all(targets.map(async (target) => {

    const id = `${target.GOOS}-${target.GOARCH}` // path and id
    const outputDir = join(".bin", id)
    const path = `${outputDir}${sep}`

    // set environment variable and build
    await exec(
        platform() === "win32"
            ? `set "GOOS=${target.GOOS}" && set "GOARCH=${target.GOARCH}" && go build -o ${path} .`
            : `export GOOS=${target.GOOS} GOARCH=${target.GOARCH} && go build -o ${path} .`
    )

    logProgress()

    return {
        ...target,
        path: join(outputDir, readdirSync(outputDir)[0]).replace(/\\/g, "/")
    }
}))

writeFileSync(
    join(".bin", "manifest.json"),
    JSON.stringify(data),
    "utf-8"
)