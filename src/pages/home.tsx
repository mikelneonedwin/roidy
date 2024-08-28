/* eslint-disable react-refresh/only-export-components */

import Store from "@/context";
import { Link, useNavigate } from "react-router-dom";

export const index = true;

export async function loader(): Promise<Response | null> {
    const state = Store.getState()
    if (state.app.routeError) return Response.redirect("/error");
    if (state.app.main) return Response.redirect("/device/" + state.app.main.id)
    return null
}

const ConnectWithUSB = () => {
    return (
        <Link
            to="/connect/usb"
            className="btn blue"
        >
            Connect via USB
        </Link>
    )
}

export const Component = () => {
    const navigateTo = useNavigate();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        document.querySelector("dialog")?.close();
        // @ts-expect-error show is the name prop of the checkbox
        const dontShow: boolean = event.target.show.checked;
        if (dontShow) localStorage.setItem("no-confirm-wireless", "true");
        navigateTo("/connect/wirelessly")
    }
    return (
        <>
            <section>
                <h1 className="text-2xl leading-loose font-semibold">No devices connected <br /> (&gt;_&lt;)</h1>
                <div className="flex gap-2 justify-center items-center">
                    <ConnectWithUSB />
                    {localStorage.getItem("no-confirm-wireless") === "true"
                        ? (
                            <Link
                                to="/connect/wirelessly"
                                className="btn white"
                            >
                                Connect Wirelessly
                            </Link>
                        ) : (
                            <button
                                onClick={() => document.querySelector("dialog")?.showModal()}
                                className="btn white"
                            >
                                Connect Wirelessly
                            </button>
                        )

                    }
                </div>
            </section>
            <dialog className="p-4 w-1/2 rounded-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <p>Your phone must have been prepared or connected previously via USB since you last booted it. If this has been done, continue, else, connect with USB first then setup wireless connection afterwards</p>
                    <div className="flex gap-2 justify-center items-center">
                        <ConnectWithUSB />
                        <button
                            type="submit"
                            className="btn white"
                        >
                            Continue
                        </button>
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" name="show" className="mr-1" />
                            Do not show this again
                        </label>
                    </div>
                </form>
            </dialog>
        </>
    );
}