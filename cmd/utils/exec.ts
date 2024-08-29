import { execSync } from "child_process"
import { platform } from "os"
import { writeFileSync } from "fs"

interface command extends ReturnType<typeof exec> {
    command: string
}

const commands: command[] = [];

function wrap(cmd: string) {
    const data = exec(cmd);
    commands.push({
        command: cmd,
        ...data
    })
    writeFileSync(
        "log.json",
        JSON.stringify(commands),
        "utf-8"
    );
    return data;
}

function exec(cmd: string) {
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

export default function (cmd: cmd) {
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
    switch (process.env.NODE_ENV) {
        case "production": return exec(cmd)
        default: return wrap(cmd)
    }
}