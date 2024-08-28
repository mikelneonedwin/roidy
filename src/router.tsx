import { createBrowserRouter } from "react-router-dom";
import { DeviceLayout, OpenLayout } from "./layouts";
import { ConnectWirelessly, ConnectWithUSB, Home, Device } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OpenLayout />,
    children: [
      Home,
      {
        path: "/connect/usb",
        element: <ConnectWithUSB />
      },
      {
        path: "/connect/wirelessly",
        element: <ConnectWirelessly />
      }
    ]
  },
  {
    path: "/device/:id",
    element: <DeviceLayout />,
    children: [
      {
        index: true,
        element: <Device/>
      }
    ]
  },
])

export default router;
