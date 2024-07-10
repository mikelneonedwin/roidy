import { downloadFile, warn, error } from "@/utils/index.js"
import conf from "conf"
import decompress from "decompress"
import { unlinkSync } from "fs"
import inquirer from "inquirer"
import { homedir, platform } from "os"
import { delimiter, join, resolve } from "path"
import shell from "shelljs"
import { adb } from "@/package.json"

// Add platforms path to
process.env.PATH =
    resolve("platform-tools")
    + delimiter
    + process.env.PATH

const config = new conf({
    projectName: "roidy",
})

if (!config.get("config")) {
    config.set("config", true)
    config.set("download", join(homedir(), "Downloads"))
}

export default async function validateAdb() {
    /* CHECK ADB INSTALLATION */
    if (shell.which("adb")) return;
    warn("Can't find ADB installation and it is required by the prorgam")
    const { install } = await inquirer.prompt([
        {
            type: "confirm",
            message: "Do you want to install ADB",
            name: "install"
        }
    ])

    if (!install) throw error("ADB not installed")

    const os = platform()

    if (!(os in adb)) throw error("ADB Download options not found for your device, visit https://developer.android.com/tools/releases/platform-tools to see available ADB download options for your device")

    // download zip file to bin directory
    const zipPath = resolve("bin", "adb.zip")
    // @ts-expect-error, checking has been done to ensure path exists
    await downloadFile(adb[os], zipPath)
        .catch((err: Error) => {
            throw error(err.message)
        })
    // decompress zip file
    await decompress(zipPath, resolve("."))
        .catch((err: Error) => {
            throw error(err.message)
        })
    // delete downloaded zip file
    unlinkSync(zipPath)
}

