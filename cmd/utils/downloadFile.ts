import { createWriteStream, unlinkSync } from "fs";
import http from "http";
import https from "https";
import ensureDir from "./ensureDir";
import progressBar from "./progressBar";

function formatBytes(bytes: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    while (bytes >= 1024) {
        bytes /= 1024;
        units.shift()
    }
    return {
        unit: units[0],
        value: bytes.toFixed(2)
    }
}

/**
 * Download a file over the internet and store it on the local machine
 */
export default function downloadFile(fileUrl: string, outputPath: string) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(fileUrl);
        const protocol = parsedUrl.protocol === "https:" ? https : http

        ensureDir(outputPath)
        const file = createWriteStream(outputPath)


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

                const totalSize = parseInt(response.headers['content-length'] || '0', 10);
                let downloadedSize = 0
                const bar = progressBar();

                response.on("data", (chunk: Buffer) => {
                    downloadedSize += chunk.length
                    bar({
                        download: formatBytes(downloadedSize),
                        source: formatBytes(totalSize)
                    })
                })

            })
            .on("error", err => {
                unlinkSync(outputPath)
                reject("Download Error: " + err.message)
            })
    })
}