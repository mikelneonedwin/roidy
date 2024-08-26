import { ConnectWithUSB, getDeviceList } from "../cmd";
import { error } from "../cmd/utils";
import { Router } from "express";

const api = Router();

// api for the home route
api.get("/api/devices", (
    _req: ExpressRequest,
    res: ExpressResponse
) => {
    const devices = getDeviceList();
    res.json(devices);
})

// api to trigger connection via usb
api.post("/api/connect/usb", (
    _req: ExpressRequest,
    res: ExpressResponse
) => {
    try {
        res.json(ConnectWithUSB())
    }
    catch (err) {
        const { message } = err as Error;
        error(message)
        res.status(500).send(message)
    }
})

export default api;