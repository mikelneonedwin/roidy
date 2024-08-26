import { createBrowserRouter } from "react-router-dom";
import { MainLayout, OpenLayout } from "./layouts";
import { ConnectWithUSB, Home, NoDevicesConnected } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      Home,
    ]
  },
  {
    path: "/",
    element: <OpenLayout />,
    children: [
      {
        path: "/no-devices-connected",
        element: <NoDevicesConnected />
      },
      {
        path: "/connect/usb",
        element: <ConnectWithUSB />
      }
    ]
  }
])

export default router;
