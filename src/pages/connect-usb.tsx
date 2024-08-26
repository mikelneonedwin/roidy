import { Seo } from "@/components"
import Store, { addDevice, setMain } from "@/context"
import { useState } from "react"
import { links } from "../../package.json"
import { useNavigate } from "react-router-dom"

const Step1 = (
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

const Step2 = "Connect your android to your PC via a working USB cable."

const Step3 = (
    <>
        If a debugging prompt shows up on your android, follow the on-screen prompts to enable the connection.
        <br /> Once done, click "Connect" to connect your device. Your PC and Android might disconnect momentarily
    </>
)

const ConnectWithUSB = () => {
    // state
    const [item, setItem] = useState(0);
    const [error, setError] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

    const steps = [Step1, Step2, Step3]
    function next() {
        return item === steps.length - 1
            ? connect()
            : setItem(item + 1)
    }

    async function connect() {
        setLoading(true)
        setError(<span className="!text-lightfont">Connecting...</span>)
        try {
            const res = await fetch("/api/connect/usb", {
                method: "POST"
            })
            setLoading(false)
            if (!res.ok) return setError(await res.text());

            const devices: Device[] = await res.json();
            if (!devices.length) return setError("No devices found")

            // add devices to store
            Store.dispatch(addDevice(devices));
            Store.dispatch(setMain(devices[0]));

            navigateTo(`/devices/${devices[0]}`)
        }
        catch (err) {
            setLoading(false)
            // @ts-expect-error ...
            return setError(err.message)
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
                                <h4 className="text-lg font-semibold">Step {item + 1}</h4>
                                {steps[item]}
                            </>
                        )}
                    </p>
                    <div>
                        <button
                            onClick={next}
                            className="btn blue"
                            disabled={loading}
                        >
                            {item === steps.length - 1
                                ? "Connect"
                                : "Continue"
                            }
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ConnectWithUSB;