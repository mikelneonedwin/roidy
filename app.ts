import { program } from "commander";
import { checkadb, downloadadb } from "./cmd";
import { error, info, warn } from "./cmd/utils";
import { version } from "./package.json";
import server from "./server/main";

process.env.NODE_ENV = "production"

async function app() {

    program
        .version(version)
        .description("Roidy CLI")

    // start server
    program
        .command("start [port]")
        .description("Open in browser")
        .action(({ port }) => {
            const tmp = isNaN(+port)
                ? undefined
                : +port
            server(tmp);
        })

    // default action start gui
    program.action(() => server())

    // display help message
    if (
        process.argv.includes("--help") ||
        process.argv.includes("-h") ||
        process.argv.includes("help")
    )
        return program.help()

    // clear console for session to begin
    console.clear()

    if (!checkadb()) {
        warn("ADB not installed")
        info("Installing ADB for local use")
        await downloadadb()
    }

    // test adb
    if (!checkadb()) {
        error("Installation failed")
        process.exit(1)
    }

    // run cli
    program.parse(process.argv)

}

app()