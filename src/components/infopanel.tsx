import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom";
import { battery as batteryFn, storage as storageFn } from "../../cmd";

const InfoPanel = () => {
    const params = useParams()
    const storage = useQuery({
        queryKey: [params.id, "storage"],
        async queryFn() {
            const res = await fetch("/api/storage/" + params.id!)
            if (!res.ok) throw new Error(await res.text())
            return await res.json() as ReturnType<typeof storageFn>
        }
    })
    const battery = useQuery({
        queryKey: [params.id, "battery"],
        async queryFn() {
            const res = await fetch("/api/battery/" + params.id!)
            if (!res.ok) throw new Error(await res.text())
            return await res.json() as ReturnType<typeof batteryFn>
        }
    })
    return (
        <div className="sidebar right-0">
            {/* storage */}
            <div>
                <h4>
                    {storage.error
                        ? storage.error.message
                        : "Internal Storage"
                    }
                </h4>
                {storage.isLoading && <p>Loading...</p>}
                {storage.data && (
                    <div>
                        <progress
                            max={100}
                            value={+storage.data.usage.match(/\d+/)![0]}
                        >
                        </progress>
                        <span>{storage.data.available} free of {storage.data.size}</span>
                    </div>
                )}
            </div>
            {/* battery */}
            <div>
                <h4>
                    {battery.error
                        ? battery.error.message
                        : "Battery"
                    }
                </h4>
                {battery.isLoading && <p>Loading...</p>}
                {battery.data && (
                    <div>
                        <progress
                            max={100}
                            value={battery.data.level}
                        >
                        </progress>
                        <span className="capitalize">{battery.data.level}% - {battery.data.status}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InfoPanel;