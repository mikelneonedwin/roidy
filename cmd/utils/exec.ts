import { execSync, spawnSync } from "child_process"
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
        // const output = response.toString().trim()
        // const silentError = /adb(\.exe)?:/.test(output);
        return {
            error: false,
            stderr: "",
            stdout: response.toString().trim()
        }
    } catch (err) {
        const error = err as ReturnType<typeof spawnSync>;
        return {
            error: true,
            stderr:
                error.stderr.toString().trim() ||
                error.stdout.toString().trim(),
            stdout: ""
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