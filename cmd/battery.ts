import { exec } from "./utils";

export default function battery(id: string) {
    const data = exec(`adb -s ${id} shell dumpsys battery`)
    if (data.error) throw new Error(data.stderr)
    const status_temp = +data.stdout.match(/status:\s*(\d)/)![1]
    let status: "charging" | "discharging" | "not charging" | "full" | "unknown"
    switch (status_temp) {
        // case 1: status = "unknown"; break;
        case 2: status = "charging"; break;
        case 3: status = "discharging"; break;
        case 4: status = "not charging"; break;
        case 5: status = "full"; break;
        default: status = "unknown";
    }
    const health_temp = +data.stdout.match(/health:\s*(\d)/)![1]
    let health: "unknown" | "good" | "overheat" | "dead" | "over voltage" | "unspecified failure" | "cold" | "unknown error"
    switch (health_temp) {
        // case 1: status = "unknown"; break;
        case 2: health = "good"; break;
        case 3: health = "overheat"; break;
        case 4: health = "dead"; break;
        case 5: health = "over voltage"; break;
        case 6: health = "unspecified failure"; break;
        case 7: health = "cold"; break;
        case 8: health = "unknown error"; break;
        default: health = "unknown";
    }
    const temperature = +data.stdout.match(/temperature:\s*(\d+)/)![1] / 10
    const technology = data.stdout.match(/technology:\s*(.+)/)![1]
    const voltage = +data.stdout.match(/voltage:\s*(\d+)/)![1] / 1000
    const level = +data.stdout.match(/level:\s*(\d+)/)![1]
    return { status, health, temperature, technology, voltage, level }
}