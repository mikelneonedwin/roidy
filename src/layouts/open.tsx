import { Outlet, ScrollRestoration } from "react-router-dom";

const OpenLayout = () => {
    return (
        <>
            <ScrollRestoration />
            <Outlet />
        </>
    );
}

export default OpenLayout;