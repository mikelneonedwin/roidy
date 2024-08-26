import { connectGateway, connectViaIp, connectWithUSB, getDeviceList } from "../cmd";
import { error, exec } from "../cmd/utils";
import { Router } from "express";

const api = Router();

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function promisifyError(callback: Function) {
    return new Promise((resolve, reject) => {
        try {
            resolve(callback())
        } catch (err) {
            reject(err)
        }
    })
}

function sendError(
    err: Error,
    res: ExpressResponse
) {
    error(err.message)
    res.status(500)
    res.send(err.message)
}

// list connected devices
api.get("/api/devices", (
    _req: ExpressRequest,
    res: ExpressResponse
) => res.json(getDeviceList()))

// trigger connection via usb
api.get("/api/connect/usb", (
    _req: ExpressRequest,
    res: ExpressResponse
) => {
    promisifyError(connectWithUSB)
        .then(res.json)
        .catch((err) => sendError(err, res))
})

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
    if (data.code !== 0) return res.json([])
    const ips = data.stderr.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi)
    res.json(ips || [])
})

// connect to a device via it's ip address
api.get("/api/connect/ip/:ip", (
    req: ExpressRequest,
    res: ExpressResponse
) => res.json(connectViaIp(req.params.ip)))

export default api;