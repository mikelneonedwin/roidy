import { exec } from "./utils";

/**
 * Return a list of files and folders from a directory
 */
export default function readdir(id: string, path?: string) {
    path = path ?? "";
    const data = exec(`adb -s ${id} shell ls -l '/sdcard/${path}'`);
    if (data.error) throw new Error(data.stderr)
    if (!data.stdout.trim()) return [];
    if (data.stdout.startsWith(path) && path) throw new Error("No such file or directory")
    return data
        .stdout
        .replace(/\r/g, "\n")
        .split(/\n+/g)
        .map((item) => {
            let type: "file" | "dir" | "unknown"

            switch (item[0]) {
                case "-": type = "file"; break;
                case "d": type = "dir"; break;
                default: type = "unknown"
            }

            const name = item.match(/:\d+\s+(.+)$/)![1];
            const info = {
                name,
                type,
                path: `${path}/${name}`.replace("/", "")
            }

            if (type !== "file") return info;

            return {
                ...info,
                ext: name.split(".").pop()
            }
        })
}

export type dirdata = ReturnType<typeof readdir>[0]