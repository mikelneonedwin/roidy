import getDeviceList from "./deviceList";
import { exec, ip_pattern } from "./utils";

/**
 * Scans the ip configuration of the computer and
 * @returns 
 */
export default function connectGateway(): Device[] {
    const data = exec({
        win: "ipconfig",
        default: "ifconfig"
    })
    if (data.error) throw new Error(data.stderr)
    // extract the ip address from the list of gateways
    const ips = data.stdout.match(new RegExp(ip_pattern, "g"))
    // connect to each
    if (ips) ips.forEach((ip) => exec(`adb connect ${ip}`))
    return getDeviceList();
}