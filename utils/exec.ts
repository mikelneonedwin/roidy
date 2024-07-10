import { execSync } from "child_process"

function exec(cmd: string) {
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