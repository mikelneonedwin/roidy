import { Router } from "express";
import { rmSync } from "fs";
import { tmpdir } from "os";
import { basename, dirname, join } from "path";
import {
    battery,
    connectGateway,
    connectViaIp,
    connectWithUSB,
    downloadFrom,
    getDeviceList,
    readdir,
    storage
} from "../cmd";
import { error, exec, ip_pattern } from "../cmd/utils";
import { handle } from "./utils";

const api = Router();

// list connected devices
api.get("/api/devices", (
    _req: ExpressRequest,
    res: ExpressResponse
) => res.json(getDeviceList()))

// trigger connection via usb
api.get("/api/connect/usb", (
    _req: ExpressRequest,
    res: ExpressResponse
) => handle(connectWithUSB, res))

// connect to ip addresses detected on the network
api.get("/api/connect/gateway", (
    _req: ExpressRequest,
    res: ExpressResponse
) => res.json(connectGateway()))

// send back a list of visible ip addresses on the network
api.get("/api/local_ips", (
    _req: ExpressRequest,
    res: ExpressResponse
) => {
    const data = exec({
        win: "ipconfig",
        default: "ifconfig"
    })
    if (data.error) {
        res.status(500)
        res.send("An unknown error occured")
        return error(data.stderr)
    }
    const match = (x: RegExp) => data.stdout.match(x);
    const ips = match(new RegExp(ip_pattern, "g"));
    return res.json(ips || [])
})

// connect to a device via it's ip address
api.get("/api/connect/ip/:ip", (
    req: ExpressRequest,
    res: ExpressResponse
) => res.json(connectViaIp(req.params.ip)))

// get info on internal storage
api.get("/api/:id/storage", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => storage(req.params.id), res))

// get battery info
api.get("/api/:id/battery", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => battery(req.params.id), res))

// read home directory on android
api.get("/api/:id/files", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => readdir(req.params.id), res))

// read a directory
api.get("/api/:id/files/*", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => readdir(req.params.id, req.params[0]), res))

// download a file to the computer and send it to the browser to download
api.get("/api/:id/download/*", (
    req: ExpressRequest,
    res: ExpressResponse
) => {
    const source = req.params[0];
    const destination = join(
        tmpdir(),
        Date.now().toString(),
        basename(source)
    )
    const del = () => rmSync(
        dirname(destination),
        {
            recursive: true,
            force: true
        }
    )
    res.on("close", del);
    res.on("finish", del);
    res.on("error", del);
    try {
        downloadFrom(
            req.params.id,
            source,
            destination
        )
        res.download(destination)
    } catch (err) {
        error(err as Error);
        res.status(500)
        res.send("Unable to download file")
    }
})

export default api;