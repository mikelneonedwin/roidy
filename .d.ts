/**
 * Serial numbers for connected android devices
 */
declare var devices: string[]

/**
 * Command to be executed with @utils/exec
 */
type cmd = string | {
    /**
     * Command for Windows
     */
    win?: string
    /**
     * Command for macOS
     */
    mac?: string
    /**
     * Command for Linux
     */
    linux?: string
    /**
     * Default fallback command for all operating systems
     */
    default: string,
}

type FileCopyOptions = {
    /**
     * What type of item is being copied
     */
    type: "file" | "files" | "dir" | "dirs"
    /**
     * The target destination device
     */
    destination: "pc" | "same" | String
    /**
     * The device containing the files to be copied
     */
    source: string
    /**
     * Preferred method to locate the files to be copied
     */
    method: "browse" | "path"
}