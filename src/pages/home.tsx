import Store, { setRouteError } from "@/context";

export const index = true;

// eslint-disable-next-line react-refresh/only-export-components
export async function loader(): Promise<Device[] | Response> {
    const resp = await fetch("/api/devices");

    if (!resp.ok) {
        Store.dispatch(setRouteError({
            message: resp.statusText,
            status: resp.status
        }))
        return Response.redirect("/error");
    }
    try {

        const data: Device[] = await resp.json();
        if (data.length) return data
        return Response.redirect("/no-devices-connected");
    }

    catch (err) {
        Store.dispatch(setRouteError({
            // @ts-expect-error ...
            message: err.message
        }))
        return Response.redirect("/error");
    }
}

export const Component = () => {
    return (
        <>

        </>
    );
};
