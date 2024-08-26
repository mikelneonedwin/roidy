import Store from "@/context";
import { useSelector } from "react-redux";

const Topbar = () => {
    const main = useSelector((state: Store) => state.app.main);
    return (
        <header className="bg-[#646cff] py-1 text-white text-center uppercase tracking-widest font-bold text-lg">
            {main?.name || "Roidy"}
        </header>
    );
}

export default Topbar;