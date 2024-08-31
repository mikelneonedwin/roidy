import { exec } from "./utils";

/**
 * Return a list of files and folders from a directory
 */
export default function readdir(id: string, path: string) {
    const data = exec(`adb -s ${id} shell ls -l ${path}`);
    if (data.error) throw new Error(data.stderr)
    if (!data.stdout.trim()) return [];
    if (data.stdout.startsWith(path)) throw new Error("No such file or directory")
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
            if (type !== "file") return { name, type }
            return {
                name,
                type,
                ext: name.split(".").pop()
            }
        })
}

export type dirdata = ReturnType<typeof readdir>