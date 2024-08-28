import { error, exec } from "./utils";

export default function getDeviceList(): Device[] {
    const deviceList = exec("adb devices")
    if (deviceList.error) throw error(deviceList.stderr)
    return deviceList
        .stdout
        // remove the undesired parts of the result
        .replace(/\tdevice/g, "")
        .replace(/.*list\sof.+\r\n/i, "")
        .trim()
        // split based on new lines
        .split(/\r?\n/g)
        // remove ports from devices identified by ip addesses
        .map((ip: string) => ip.replace(/:\d+/g, ""))
        // remove void items from the list
        .filter(Boolean)
        // get the name of the device from the id
        .map((id: string) => {
            const data = exec(`adb -s ${id} shell getprop ro.product.model`)
            if (data.error) throw error(data.stderr)
            return {
                id,
                name: data.stdout,
                connected: true
            }
        });
}