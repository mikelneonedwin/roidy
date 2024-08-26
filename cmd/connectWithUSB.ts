import getDeviceList from "./deviceList";
import { exec } from "./utils";

export default function ConnectWithUSB(): Device[] {
    const data = exec("adb tcpip 5555")
    if (data.code !== 0) throw new Error(data.stderr.trim());
    return getDeviceList();
}