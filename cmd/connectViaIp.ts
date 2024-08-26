import { getDeviceList } from "."
import { exec } from "./utils"

/**
 * Connects to a device via its IP address
 */
export default function connectViaIp(ip: string): Device[] {
    exec(`adb connect ${ip}`)
    return getDeviceList()
}