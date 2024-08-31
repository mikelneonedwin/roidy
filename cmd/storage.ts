import { error, exec } from "./utils";

// function calcSize(data: number) {
//     const capacity = ["bytes", "KB", "MB", "GB", "TB"];
//     while (data > 1024) {
//         data /= 1024;
//         capacity.shift();
//     }
//     return data.toFixed(2) + capacity[0];
// }

/**
 * Get information concerning the user's storage drive
 */
export default function storage(id: string) {
    const data = exec(`adb -s ${id} shell df /data -h`);    
    if (data.error) throw new Error(data.stderr);
    try {
        const [size, used, available, storage] = data
            .stdout
            .match(/\d+(G|M|K)?%?\s/g)!
        return {
            size: size.trim() + "B",
            used: used.trim() + "B",
            available: available.trim() + "B",
            usage: storage.trim()
        }

    } catch (err) {
        // @ts-expect-error ...
        error(err.message)
        throw new Error("Unable to get storage data")
    }
}