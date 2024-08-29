import { Icon, Seo } from "@/components"
import Store, { addDevice, setMain } from "@/context"
import { useState } from "react"
import { links } from "../../package.json"
import { Link, useNavigate } from "react-router-dom"

const steps: Step[] = [
    {
        body: (
            <>
                On your Android, make sure <b>Developer Options</b> is turned on.
                <br /> Visit {` `}
                <a
                    href={links["dev-options"]}
                    target="_blank"
                    className="hover:underline"
                >
                    {links["dev-options"]}
                </a>
                {` `}for help.
            </>
        )
    },
    {
        body: "Connect your android to your PC via a working USB cable."
    },
    {
        body: (
            <>
                If a debugging prompt appears on your android, follow its instructions to enable the connection.
                <br /> Once done, click "Connect" to connect your device. Your PC and Android might disconnect momentarily
            </>
        ),
        btn: "Connect"
    }
]



const ConnectWithUSB = () => {
    // state
    const [item, setItem] = useState(0);
    const [error, setError] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);
    // indicate whether there was an attempt to connect with the usb
    const [tried, setTried] = useState(false);
    const navigateTo = useNavigate();

    function next() {
        return item === steps.length - 1
            ? connect()
            : setItem(item + 1)
    }

    async function connect() {
        setLoading(true)
        setError(
            <span className="!text-lightfont">
                Connecting...
            </span>
        )
        try {
            const res = await fetch("/api/connect/usb")
            if (!res.ok) throw new Error(await res.text());

            const devices: Device[] = await res.json();
            if (!devices.length) throw new Error("No devices found")

            // add devices to store
            Store.dispatch(addDevice(devices));
            Store.dispatch(setMain(devices[0]));

            navigateTo(`/device/${devices[0].id}`)
        }
        catch (err) {
            setTried(true)
            setLoading(false)
            // @ts-expect-error ...
            setError(err.message)
        }

    }

    return (
        <>
            <Seo title="Connect Via USB" />
            <section>
                <div className="flex flex-col gap-4 mx-auto w-3/4">
                    <h1 className="text-2xl leading-loose font-semibold">
                        Connect Via USB
                        <Icon
                            icon={(!error === !loading)
                                ? "usb"
                                : "usb_off"
                            }
                            className="text-3xl block"
                        />
                    </h1>
                    <p
                        className={error
                            ? "text-red-500 font-semibold"
                            : undefined
                        }
                    >
                        {error || (
                            <>
                                <b className="text-lg font-semibold">Step {item + 1}</b>:
                                {" "}{steps[item].body}
                            </>
                        )}
                    </p>
                    <div className="flex gap-4 items-center justify-center">
                        <button
                            onClick={next}
                            className="btn blue"
                            disabled={loading}
                        >
                            {steps[item].btn || "Continue"}
                        </button>
                        {tried && (
                            <Link
                                to="/connect/wirelessly"
                                className="btn white"
                            >
                                Connect Wirelessly
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ConnectWithUSB;