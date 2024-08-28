import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from "./router"
import { HelmetProvider } from "react-helmet-async"
import { Provider } from "react-redux"
import Store, { addDevice, setMain, setRouteError } from './context'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     retry: process.env.NODE_ENV === "test" ? false : 3
  //   }
  // }
})


// load startup data
try {
  const res = await fetch("/api/devices")
  if (!res.ok) {
    Store.dispatch(setRouteError({
      message: await res.text(),
      status: res.status
    }))
  } else {
    const devices: Device[] = await res.json();
    if (!devices.length) throw null
    Store.dispatch(addDevice(devices))
    // set or confirm main device
    const match = /^.+\/devices\/(.+)\/.*/
    if (!match.test(location.href))
      Store.dispatch(setMain(devices[0]))
    else {
      const id = location.href.match(match)![1]
      const device = devices.find((device) => device.id === id);
      if (device) Store.dispatch(setMain(device))
    }
  }
  // eslint-disable-next-line no-empty
} catch { }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={Store}>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)