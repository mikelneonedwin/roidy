import { configureStore, createSlice } from "@reduxjs/toolkit";

const app = createSlice({
    name: "app-store",
    initialState: {
        devices: <Device[]>[],
        main: <Device | null>(null),
        routeError: <RouteError | null>(null)
    },
    reducers: {
        addDevice(state, action: Action<Device | Device[]>) {
            if (Array.isArray(action.payload))
                state.devices.push(...action.payload)
            else
                state.devices.push(action.payload)
        },
        setMain(state, action: Action<Device | null>) {
            state.main = action.payload
        },
        setRouteError(state, action: Action<RouteError | null>) {
            state.routeError = action.payload
        },
        removeDevice(state, action: Action<string>) {
            const index = state.devices.findIndex((device) => {
                return device.id === action.payload
            })
            state.devices.splice(index, 1);
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

type Store = ReturnType<typeof Store["getState"]>;

export type { Store };