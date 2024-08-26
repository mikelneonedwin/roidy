import { Outlet, ScrollRestoration } from "react-router-dom";
import { Topbar, Navbar, InfoPanel } from "@/components";

const MainLayout = () => {
    return (
        <>
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

export default MainLayout;