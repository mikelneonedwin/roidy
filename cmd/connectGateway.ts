import getDeviceList from "./deviceList";
import { exec } from "./utils";

/**
 * Scans the ip configuration of the computer and
 * @returns 
 */
export default function connectGateway(): Device[] {
    const data = exec({
        win: "ipconfig",
        default: "ifconfig"
    })
    if (data.code !== 0) throw new Error(data.stderr.trim())
    // extract the ip address from the list of gateways
    const ips = data.stdout.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi)
    // connect to each
    if (ips) ips.forEach((ip) => exec(`adb connect ${ip}`))
    return getDeviceList();
}