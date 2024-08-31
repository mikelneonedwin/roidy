import { error, exec } from "./utils";

export default function getDeviceList() {
    const data = exec("adb devices")
    if (data.error) throw error(data.stderr)

    const ids = JSON
        .stringify(data.stdout.trim())
        .match(/[\d.]{5,}(:\d+)?/g);

    if (!ids) return [];

    return ids.map((id: string) => {
        const data = exec(`adb -s ${id} shell getprop ro.product.model`)
        if (data.error) throw error(data.stderr)
        return {
            id,
            name: data.stdout
        }
    });
}

export type Device = ReturnType<typeof getDeviceList>
