import { Seo } from "@/components"
import Store, { addDevice, setMain } from "@/context"
import { useState } from "react"
import { links } from "../../package.json"
import { useNavigate } from "react-router-dom"

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
            setLoading(false)
            if (!res.ok) return setError(await res.text());

            const devices: Device[] = await res.json();
            if (!devices.length) return setError("No devices found")

            // add devices to store
            Store.dispatch(addDevice(devices));
            Store.dispatch(setMain(devices[0]));

            navigateTo(`/devices/${devices[0].id}`)
        }
        catch (err) {
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
                    <h1 className="text-2xl leading-loose font-semibold">Connect Via USB</h1>
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
                    <div>
                        <button
                            onClick={next}
                            className="btn blue"
                            disabled={loading}
                        >
                            {steps[item].btn || "Continue"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ConnectWithUSB;