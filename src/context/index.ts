import { configureStore, createSlice } from "@reduxjs/toolkit";

const app = createSlice({
    name: "app-store",
    initialState: {
        devices: <Record<string, Device>>{},
        main: <Device | null>(null),
        routeError: <RouteError | null>(null)
    },
    reducers: {
        addDevice(state, action: Action<Device | Device[]>) {
            if (Array.isArray(action.payload)) {
                action.payload.forEach((device) => {
                    state.devices[device.id] = device;
                })
            }
            else
                state.devices[action.payload.id] = action.payload
        },
        setMain(state, action: Action<Device | null>) {
            state.main = action.payload
        },
        setRouteError(state, action: Action<RouteError | null>) {
            state.routeError = action.payload
        },
        removeDevice(state, action: Action<string>) {
            delete state.devices[action.payload];
        }
    }
})

export const {
    addDevice,
    removeDevice,
    setMain,
    setRouteError
} = app.actions;

const Store = configureStore({
    reducer: {
        app: app.reducer
    }
})

export default Store;

export type Store = ReturnType<typeof Store["getState"]>;w