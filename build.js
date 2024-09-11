// @ts-check

import archiver from "archiver"
import chalk from "chalk"
import { exec as execs } from "child_process"
import { createWriteStream, mkdir, readFileSync, readdirSync, rmSync, rmdirSync, writeFileSync } from "fs"
import { platform } from "os"
import { basename, join, resolve as resolvep, sep } from "path"
import { promisify } from "util"

// build binaries for go
const manifest = readFileSync("builds.json", "utf-8")
/**  @type {typeof import("./builds.json")} */
const targets = JSON.parse(manifest)

function progress(finishedABinary = false) {
    progress.bin += +!!finishedABinary
    // creating the binary and making its archive
    const maxSteps = targets.length * 2    // 
    const finishPercentage = ++progress.value / maxSteps * 100
    const percentageText = chalk.cyan(finishPercentage.toFixed(2) + "%")
    process.stdout.write(`\rBuilding binaries\t${percentageText}\t${chalk.yellow(progress.bin)} of ${chalk.yellow(targets.length)}`)
    if (finishPercentage === 100) console.log()
}

// keep track of how many steps left to complete build
progress.value = 0;
// keep track of binaries built
progress.bin = 0;

// create bin to store zip files
mkdir(resolvep("bin"), () => { })
// create builds
const exec = promisify(execs);
const data = await Promise.all(targets.map((target) =>
    new Promise(async (resolve, reject) => {
        // path and id
        const id = `${target.GOOS}-${target.GOARCH}`
        const path = `.${sep}${join("bin", id)}${sep}`
        // set environment variable and build
        const cmd = platform() === "win32"
            ? `cd go && set "GOOS=${target.GOOS}" && set "GOARCH=${target.GOARCH}" && go build -o ${path} .`
            : `cd go && export GOOS=${target.GOOS} GOARCH=${target.GOARCH} && go build -o ${path} .`
        await exec(cmd)
        // progress() // add to progress
        // const [filename] = readdirSync(resolvep("go", path)) // get path to built file
        // const zipPath = resolvep("bin", `${id}.zip`) // ./bin/windows-amd64.zip
        // const output = createWriteStream(zipPath) // compress file
        // /** @type {import("archiver").Archiver} */
        // const archive = archiver("zip", {
        //     zlib: { level: 9 }
        // })
        // // listen for successful compression
        // output.on("close", () => {
        //     progress(true) // true indicate a binary has been built
        //     resolve({
        //         ...target,
        //         url: `/${zipPath.replace(resolvep("."), "").replace(/\\/g, "/")}`,
        //         bytes: archive.pointer()
        //     })
        //     // delete file
        //     rmSync(filePath)
        // })
        // // throw error
        // output.on("error", reject)
        // // pipe data to output
        // archive.pipe(output)
        // // add executable
        // const filePath = resolvep("go", path, filename)
        // archive.file(filePath, {
        //     name: basename(filePath)
        // })// add dist
        // archive.directory(resolvep("dist"), "dist")
        // // finalize
        // archive.finalize()
    })
))

writeFileSync(
    resolvep("bin", "manifest.json"),
    JSON.stringify(data),
    "utf-8"
)

// delete executables folder
rmdirSync(resolvep("go", "bin"))

// create a manifest for vite to grab 