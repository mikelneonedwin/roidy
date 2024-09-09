import { ensureDir, exec, info } from "./utils";

/**
 * Copy a file from a connected android device unto the user's computer
 * @param id id of the connected device
 * @param source path on the android where he file is located
 * @param dest path on computer to copy the file to
 */
export default function downloadFrom(
    id: string,
    source: string,
    dest: string
) {
    ensureDir(dest)
    // copy file to destination
    const data = exec(`adb -s ${id} pull "/sdcard/${source}" "${dest}"`);
    if (data.error) throw new Error(data.stderr);
    info(data.stdout);
}