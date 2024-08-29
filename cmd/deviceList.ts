import { error, exec, ip_pattern } from "./utils";

export default function getDeviceList(): Device[] {
    const data = exec("adb devices")
    if (data.error) throw error(data.stderr)
    const pattern = `(\\w+|${ip_pattern})`
    return data
        .stdout
        .trim()
        .replace(/list.+attached/i, "")
        .split(/(\r|\n)/g)
        .map((txt) => {
            const pattern_1 = pattern + "(\\s{2,}|$)";
            const regex = new RegExp(pattern_1, "g");
            return txt.match(regex)
        })
        .flat()
        .reduce((ids: string[], txt) => {
            if (!txt) return ids;
            const regex = new RegExp(pattern);
            if (regex.test(txt.trim())) ids.push(txt.trim())
            return ids;
        }, [])
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