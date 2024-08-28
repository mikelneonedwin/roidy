import { Outlet, ScrollRestoration } from "react-router-dom";
import { Topbar, Navbar, InfoPanel, Seo } from "@/components";
import { useSelector } from "react-redux";

const DeviceLayout = () => {
    const main = useSelector((state: Store) => state.app.main)
    return (
        <>
            <Seo title={main?.name}/>
            <Topbar />
            <ScrollRestoration />
            <div>
                <Navbar />
                <Outlet />
                <InfoPanel />
            </div>
        </>
    );
}

export default DeviceLayout;