import { dim, error, exec, info, warn } from "@/utils/index.js"
import inquirer from "inquirer"
import ora from "ora"
import shell from "shelljs"

function connectToGateways() {
    const spinner = ora("Searching for available devices on network").start()
    const ipconfig = exec("ipconfig")
    if (ipconfig.code !== 0) return spinner.fail(ipconfig.stderr)

    // scan the network for default gateways - possible android devices
    const gateways = ipconfig.stdout.match(/default\sgateway.+\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi)
    if (gateways === null) return spinner.fail("No devices found on network")

    const { length } = gateways
    spinner.info(`Found ${length} devices${length === 1 ? "" : "s"} on network`)
    if (!length) return

    // attempt to connect to each device via adb
    spinner.start("Connecting")
    const ips = gateways.map((gate: string) => gate.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)![0])
    ips.forEach((ip: string, index: number) => spinner.text = `Connecting ${index + 1} of ${ips.length}`)

    devices.splice(0, devices.length);
    devices.push(...getDeviceList())

    if (!devices.length) return spinner.fail("Connections failed")
    spinner.succeed(`Successfully connected to ${devices.length} devices`)
}

async function connectViaUSB() {
    const { usb } = await inquirer.prompt([{
        name: "usb",
        message: "Would you like to connect via USB?",
        type: "confirm"
    }])
    if (!usb) return

    console.clear()

    info("Turn on developer options on your android")
    dim("visit https://developer.android.com/studio/debug/dev-options for help")
    console.log("Connect your android to your PC via a working USB cable")
    console.log("If a debugging prompt shows up on your android, follow the prompts to enable the connection")
    console.log("Your PC and Android might momentarily experience a disconnect")
    await inquirer.prompt([{
        message: "Press enter to initiate connection",
        type: "input",
        name: "enter"
    }])

    console.clear()

    // prep device for wireless connection
    const tcpip = exec("adb tcpip 5555")
    if (tcpip.code !== 0) return error(tcpip.stderr)

    const { wireless } = await inquirer.prompt([{
        message: "Would you like to continue wirelessly?",
        type: "confirm",
        name: "wireless"
    }])

    if (!wireless) return devices.push(...getDeviceList())

    info("Connect your PC and Android to the same Wifi/Tethering network")
    const { source } = await inquirer.prompt([{
        name: "source",
        message: "Is your Android devcie the source of the network?",
        type: "confirm"
    }])

    if (source) {
        connectToGateways()
        if (!devices.length) shell.exit(1)
    } else {
        dim("IP address should be available at System>About>IP Address")
        async function getIP() {
            const { ip } = await inquirer.prompt([{
                name: "ip",
                message: "Input your phone's IP address",
                type: "input"
            }])
            if (ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) return ip
            warn("Invalid IP address")
            return getIP()
        }
        const ip = await getIP()
        const connect = exec(`adb connect ${ip}`)
        if (connect.code !== 0) return error(`Connection failed: ${connect.stderr}`)
        devices.push(ip)
    }
}

function getDeviceList() {
    const deviceList = exec("adb devices")
    if (deviceList.code !== 0) throw error(deviceList.stderr)
    return deviceList
        .stdout
        .replace(/\tdevice/g, "")
        .replace(/.*list\sof.+\r\n/i, "")
        .trim()
        .split("\r\n")
        .map((ip: string) => ip.replace(/:\d+/g, ""))
        .filter(Boolean)
}

export default async function validateConnections() {
    const devices = globalThis.devices = getDeviceList()
    if (!devices.length) {
        warn("No connected devices found")
        connectToGateways()
    }
    if (!devices.length) await connectViaUSB()
    if(!devices.length) throw error("No devices connected!")
}