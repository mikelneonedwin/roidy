import { execSync } from "child_process"
import { platform } from "os"

function exec(cmd: cmd) {
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
            code: 0,
            stderr: '',
            stdout: response.toString()
        }
    } catch (error) {
        return {
            // @ts-expect-error
            code: error.status,
            // @ts-expect-error
            stderr: error.stderr.toString(),
            stdout: ''
        }
    }
}

export default exec