import decompress from "decompress";
import { unlinkSync } from "fs";
import { platform } from "os";
import { resolve } from "path";
import { links } from "../package.json";
import { downloadFile, exec } from "./utils";

/**
 * Check if adb is available for Roidy to use
 */
export const checkadb = () =>
    !exec({
        win: "where adb",
        default: "which adb"
    }).error

/**
 * Download adb for local use by Roidy
 */
export async function downloadadb() {
    const os = platform();
    if (!(`adb-${os}` in links)) throw new Error(`Cannot find adb installation for this device, visit ${links["platform-tools"]} to see available options for your device`)
    // download path for zip file
    const zipPath = resolve("bin", "adb.zip")
    // @ts-expect-error handled in the previous if statement
    await downloadFile(links[`adb-${os}`], zipPath)
    // decompress zip file
    await decompress(zipPath, resolve("."))
    // delete zip file
    unlinkSync(zipPath)
}
