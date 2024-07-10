import { validateAdb, validateConnections } from "@/lib/index.js";
import app from "@/server/index.js";
import { exec } from "@/utils/index.js";
import chalk from "chalk";
import { program } from "commander";
import { platform } from "os";

function startServer(port?: number) {
    const listen = Number.isNaN(Number(port)) ? process.env.PORT || 3000 : port
    app.listen(listen, () => {
        console.log(chalk.green(`Server running on port ${listen}`))
        // open web in browser
        const os = platform()
        const startCmd =
            os === "win32" && "start" ||
            os === "darwin" && "open" ||
            "xdg-open"
        // exec(`${startCmd} http://localhost:${listen}`)
    })
}

(async () => {

    await validateAdb()
    await validateConnections()

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

    program.parse(process.argv)

})()

