import { createWriteStream, mkdirSync, unlinkSync } from "fs";
import http from "http";
import https from "https";
import { dirname, join } from "path";

export default function downloadFile(fileUrl: string, outputPath: string) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(fileUrl);
        parsedUrl.protocol === ""
        const protocol = parsedUrl.protocol === "https:" ? https : http
        const file = createWriteStream(outputPath)

        try { mkdirSync(join(dirname(outputPath))) } catch { }

        protocol
            .get(fileUrl, (response: http.IncomingMessage) => {
                response.pipe(file)
                file
                    .on("finish", () => {
                        file.close()
                        resolve(true)
                    })
                    .on("error", (err: Error) => {
                        file.close()
                        reject("Pipe Error: " + err.message)
                    })
            })
            .on("error", err => {
                unlinkSync(outputPath)
                reject("Download Error: " + err.message)
            })
    })
}