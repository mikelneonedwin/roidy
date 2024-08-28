import { Router } from "express";
import {
    battery,
    connectGateway,
    connectViaIp,
    connectWithUSB,
    getDeviceList,
    storage
} from "../cmd";
import { error, exec } from "../cmd/utils";

const api = Router();

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function handle(callback: Function, res: ExpressResponse) {
    try {
        res.json(callback());
    } catch (err) {
        const { message } = err as Error;
        error(message)
        res.status(500)
        res.send(message)
    }
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
    const ips = data
        .stdout
        .match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi)
    res.json(ips || [])
})

// connect to a device via it's ip address
api.get("/api/connect/ip/:ip", (
    req: ExpressRequest,
    res: ExpressResponse
) => res.json(connectViaIp(req.params.ip)))

// get info on internal storage
api.get("/api/storage/:id", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => storage(req.params.id), res))

// get battery info
api.get("/api/battery/:id", (
    req: ExpressRequest,
    res: ExpressResponse
) => handle(() => battery(req.params.id), res))


export default api;