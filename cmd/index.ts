import { delimiter, resolve } from "path";

// Add platform-tools to path in case of local adb download
process.env.PATH =
    resolve("platform-tools")
    + delimiter
    + process.env.PATH

export * from "./adb";
export { default as battery } from "./battery";
export { default as connectGateway } from "./connectGateway";
export { default as connectViaIp } from "./connectViaIp";
export { default as connectWithUSB } from "./connectWithUSB";
export { default as getDeviceList } from "./deviceList";
export { default as downloadFrom } from "./downloadFrom";
export { default as readdir } from "./readdir";
export { default as storage } from "./storage";
