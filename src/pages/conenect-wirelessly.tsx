import { Icon, Seo } from "@/components";
import Store, { addDevice, setMain } from "@/context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps: Step[] = [
    {
        body: "Connect your PC and Android to the same network",
        btn: "Connect"
    }
]

// const Connecting = () => {
//     const [i, setI] = useState(0);
//     const icons: MaterialIcon[] = [
//         "wifi_1_bar",
//         "wifi_2_bar",
//         "wifi"
//     ]
//     setTimeout(() => {
//         let j = i + 1;
//         if (j === icons.length) j = 0;
//         setI(j)
//     }, 500)
//     return (
//         <Icon
//             icon={icons[i]}
//             className="text-3xl block"
//         />
//     )
// }

const ConnectWirelessly = () => {
    // state
    const [item, setItem] = useState(0);
    const [error, setError] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);
    const UseIpState = useState<false | string[]>(false);
    /**
     * State to identify when to demand for an ip address from the user
     * 
     * When this is active, useIp will be a string of available ip addresses
     * gotten from the computer's ip configuration data.
     */
    const useIp = UseIpState[0];
    const setUseIp = UseIpState[1];

    const navigateTo = useNavigate();

    async function connectGateway() {
        setLoading(true)
        setError(
            <span className="!text-lightfont">
                Connecting...
            </span>
        )

        try {
            // connect to gateways
            const res = await fetch("/api/connect/gateway")
            setLoading(false)
            if (!res.ok) return setError(await res.text())

            const devices: Device[] = await res.json();
            if (!devices.length) {
                // ask for device ip address instead
                // collect the list of available ip addresses from the commputer for an autofill
                setLoading(true)
                const ip_res = await fetch("/api/local_ips");
                setLoading(false)
                setError(false)
                const local_ips = await ip_res.json()
                return setUseIp(local_ips);
            }

            // add devices to store
            Store.dispatch(addDevice(devices));
            Store.dispatch(setMain(devices[0]));

            navigateTo(`/devices/${devices[0].id}`)

        } catch (err) {
            setLoading(false)
            // @ts-expect-error ...
            setError(err.message)
        }
    }

    /**
     * Systematicall move between steps to be displayed in the connection process
     */
    const next = () => item === steps.length - 1
        ? connectGateway()
        : setItem(item + 1)

    /**
     * Validate the data in the ip address text input
     */
    const validateIp = (ip: string) => {
        // enable submit button
        if (ip.trim().match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
            setLoading(false)
            return true;
        };
        // alert error and disable submit button
        setLoading(true);
        setError("Invalid IP address, must match pattern x.x.x.x")
    }

    /**
     * Initiate connection to a device based on their ip address
     * @param ip ip address of the device to be connected to
     */
    async function connectToIp(ip: string) {
        setLoading(true)
        try {
            const res = await fetch(`/api/connect/ip/${ip}`);
            setLoading(false)
            if (!res.ok) return setError(await res.text())

            const devices: Device[] = await res.json();
            const target = devices.find((device) => device.id === ip);
            if (!target) return setError(`Unable to connect to ${ip}`)

            Store.dispatch(addDevice(devices))
            Store.dispatch(addDevice(target))

            navigateTo(`/devices/${target.id}`)

        } catch (err) {
            setLoading(false)
            // @ts-expect-error ...
            setError(err.message)
        }
    }

    /**
    * Handle form submission to navigate between step switching and manually handling ip address inputs
    */
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!useIp) return next();
        // @ts-expect-error local_ip refers to the input element for ip addresses
        const ip: string = event.target.local_ip.value.trim();
        if (validateIp(ip)) connectToIp(ip);
    }

    return (
        <>
            <Seo title="Connect Wirelessly" />
            <section>
                <div className="flex flex-col gap-4 mx-auto w-3/4">
                    <h1 className="text-2xl leading-loose font-semibold">
                        Connect Wirelessly
                        <Icon
                            icon={(error && useIp)
                                ? "signal_wifi_connected_no_internet_4"
                                : "wifi_tethering"
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
                            useIp ? (
                                <>Sorry an error occured, please input your phone's IP address here</>
                            ) : (
                                <>
                                    <b className="text-lg font-semibold">Step {item + 1}</b>:
                                    {" "}{steps[item].body}
                                </>
                            )
                        )}
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-4 items-center justify-center"
                    >
                        {useIp && (
                            <>
                                <input
                                    required
                                    type="text"
                                    minLength={7}
                                    maxLength={15}
                                    name="local_ip"
                                    list="local_ip"
                                    onChange={() => {
                                        setError(null)
                                        setLoading(false)
                                    }}
                                    placeholder="Type here (e.g. 192.168.44.1)"
                                    className="bg-white rounded-md p-2 focus:outline-blue-300 shadow-md w-60"
                                />
                                <datalist id="local_ip">
                                    {useIp.map((ip) => (
                                        <option
                                            key={ip}
                                            value={ip}
                                        />
                                    ))}
                                </datalist>
                            </>
                        )}
                        <button
                            type="submit"
                            className="btn blue"
                            disabled={loading}
                        >
                            {steps[item].btn || "Continue"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default ConnectWirelessly;