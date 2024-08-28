import { execSync } from "child_process"
import { platform } from "os"

export default function exec(cmd: cmd) {
    if (typeof cmd === "object") {
        const os = platform()
        switch (os) {
            case "win32": cmd = cmd.win || cmd.default
                break
            case "darwin": cmd = cmd.mac || cmd.default
                break
            case "linux": cmd = cmd.linux || cmd.default
                break
            default: cmd = cmd.default
        }
    }
    try {
        const response = execSync(cmd, {
            stdio: "pipe"
        })
        return {
            error: false,
            stderr: '',
            stdout: response.toString().trim()
        }
    } catch (error) {
        return {
            error: true,
            // @ts-expect-error ...
            stderr: error.stderr.toString().trim(),
            stdout: ''
        }
    }
}