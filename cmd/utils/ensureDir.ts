import { mkdirSync } from "fs";
import { dirname } from "path";

/**
 * Ensure every folder in a file path exists
 */
export default function ensureDir(path: string) {
    try {
        mkdirSync(
            dirname(path),
            { recursive: true }
        )
    } catch {
        /* NOTHING TO DO HERE */
    }
}