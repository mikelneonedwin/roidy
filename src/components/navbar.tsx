// import { devices, main } from "@/context";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { devices, main } = useSelector((state: Store) => state.app)
    return (
        <nav className="sidebar left-0">
            <div>
                <h4>Devices</h4>
                {devices.map((device) => (
                    <Link
                        to={"device/" + device.id}
                        key={device.id}
                    >
                        {device.name}
                    </Link>
                ))}
            </div>
            {main && (
                <div>
                    <h4>Features</h4>
                    <Link to="./files">Files</Link>
                    <Link to="./media">Media</Link>
                    <Link to="./apps">Apps</Link>
                    <Link to="./messaging">Messaging</Link>
                    <Link to="./calls">Calls</Link>
                    <Link to="./scrcpy">Scrcpy</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;