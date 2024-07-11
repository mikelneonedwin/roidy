import { validateAdb, validateConnections } from "@/lib/index.js";
import app from "@/server/index.js";
import { exec } from "@/utils/index.js";
import chalk from "chalk";
import { program } from "commander";
import { homedir } from "os";
import conf from "conf"
import { join } from "path"

const config = new conf({
    projectName: "roidy",
})

// set up config data for the program
if (!config.get("config")) {
    config.set("config", true)
    config.set("download", join(homedir(), "Downloads"))
}

function startServer(port?: number) {
    const listen = Number.isNaN(Number(port)) ? process.env.PORT || 3001 : port
    app.listen(listen, () => {
        const url = `http://localhost:${listen}`
        console.log(
            chalk.green(`Server running on port ${listen}`) +
            `visit ${chalk.blue(url)} on your browser`
        )
        // open web in browser
        exec({
            default: `xdg-open ${url}`,
            mac: `open ${url}`,
            win: `start ${url}`
        })
    })
}

(async () => {

    program
        .version("1.0.0")
        .description("Roidy CLI")

    // start express server 
    program
        .command("server [port]")
        .description("start server")
        .action(({ port }) => startServer(port))

    // // default action - start express server
    program.action(startServer)

    // display help message if help flag is passed
    if (process.argv.includes("--help") || process.argv.includes("-h")) return program.help()

    // check if the computer has adb
    await validateAdb()
    // check if there are devices connected via adb
    await validateConnections()

    program.parse(process.argv)

})()

