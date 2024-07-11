/* NOTE INQUIRER HAS SOME MESSY TYPESCRIPT ISSUES HENCE THE TS-IGNORE DIRECTIVES */

import exec from "@/utils/exec.js"
import { error, warn } from "@/utils/index.js"
import inquirer from "inquirer"

/**
 * Maps the connected devices and returns same with their model names and serial number as indicated by the device itself
 */
function listDevicesWithNamesAndIds() {
    return globalThis.devices.map(device => {
        const model = exec(`adb -s ${device} shell getprop ro.product.model`)
        if (model.code !== 0) throw error(model.stderr)
        return {
            name: model.stdout.trim(),
            value: device
        }
    })
}

/**
 * Quiz the user and get information to initiate the file sharing process
 */
async function getTransferOptions(): Promise<FileCopyOptions> {
    const options = await inquirer.prompt<FileCopyOptions>([
        {
            // @ts-expect-error
            name: "type",
            type: "list",
            message: "What do you wish to copy",
            choices: [
                {
                    name: "File",
                    value: "file",
                },
                {
                    name: "Files",
                    value: "files"
                },
                {
                    name: "Directory",
                    value: "dirs"
                },
                {
                    name: "Directories",
                    value: "dirs"
                }
            ]
        },
        {
            // @ts-expect-error
            name: "destination",
            type: "list",
            message: "Target device",
            choices: [
                {
                    name: "This PC",
                    value: "pc"
                },
                {
                    name: "Same Device",
                    value: "same"
                }
            ]
                .concat(...listDevicesWithNamesAndIds())
        },
        {
            // @ts-expect-error
            name: "source",
            type: "list",
            message: "Source Device",
            choices: listDevicesWithNamesAndIds(),
            when: globalThis.devices.length > 1
        },
        {
            // @ts-expect-error
            name: "source",
            type: "list",
            message: "Specify the device you're copying from",
            choices: listDevicesWithNamesAndIds(),
            when: globalThis.devices.length > 1
        },
        {
            name: "method",
            type: "list",
            // @ts-expect-error
            message({ type }) {
                const item =
                    type === "dir" && "directory" ||
                    type === "dirs" && "directories" || type
                return `How would you like to locate the the ${item}`
            },
            choices: [
                {
                    name: "Browse files",
                    value: "browse"
                },
                {
                    name: "Specify file path",
                    value: "path"
                }
            ]
        }
    ])

    options.source = options.source || globalThis.devices[0]
    return options;
}

/**
 * Display repitive prompts to the user to get the file path of the file they want to copy
 */
async function getFilePath(data: FileCopyOptions): Promise<{ path: string, dir: boolean }> {

    let { path } = await inquirer.prompt([{
        name: "path",
        type: "input",
        message: "Enter file path"
    }])

    path = "/sdcard/" + path.replace(/\\/g, "/").replace(/\/?sdcard\//g, "")
    path = path.replace(/\/\//g, "/")
    const stat = exec(`adb -s ${data.source} shell stat "${path}"`)

    if (stat.code === 0) return {
        path,
        dir: stat.stdout.includes("directory")
    }

    console.clear()
    warn(`File path "${path.replace("/sdcard/", "")}" is invalid`)
    return getFilePath(data)
}

async function workWithPath(data: FileCopyOptions) {
    const pathData = await getFilePath(data)
    // let sourcePath: string
    // if (pathData.dir && data.type === "dir") sourcePath = pathData.path
}

export default async function fileCopy() {
    const options = await getTransferOptions()
    options.method === "path" ? workWithPath(options) : null
}