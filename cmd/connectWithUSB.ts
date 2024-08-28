import getDeviceList from "./deviceList";
import { exec } from "./utils";

export default function ConnectWithUSB(): Device[] {
    const data = exec("adb tcpip 5555")
    if (data.error) throw new Error(data.stderr);
    return getDeviceList();
}