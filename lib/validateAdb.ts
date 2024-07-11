import { adb } from "@/package.json"
import { downloadFile, error, exec, warn } from "@/utils/index.js"
import decompress from "decompress"
import { unlinkSync } from "fs"
import inquirer from "inquirer"
import { platform } from "os"
import { delimiter, resolve } from "path"

// Add platforms path to
process.env.PATH =
    resolve("platform-tools")
    + delimiter
    + process.env.PATH

/**
 * Makes sure the `adb` command is accessible to the prorgam or try to download it if not
 */
export default async function validateAdb() {
    /* CHECK ADB INSTALLATION */
    if (exec({
        win: "where adb",
        default: "which adb"
    }).code === 0) return;

    warn("Can't find ADB installation and it is required by the prorgam")
    const { install } = await inquirer.prompt([{
        type: "confirm",
        message: "Do you want to install ADB",
        name: "install"
    }])

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