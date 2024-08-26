interface Device {
    name: string;
    id: string;
    connected: boolean;
    // battery: string;
    // storage: {
    //     capacity: number;
    //     available: number;
    // }   
    // media: string;
}

/**
 * Command to be executed with exec function
 */
type cmd = string | {
    /**
     * Command for Windows
     */
    win?: string
    /**
     * Command for macOS
     */
    mac?: string
    /**
     * Command for Linux
     */
    linux?: string
    /**
     * Default fallback command for all operating systems
     */
    default: string,
}

type ExpressRequest = import("express").Request;

type ExpressResponse = import("express").Response;

type HomeError = {
    type: "data";
    message: string;
} | {
    type: "server"
    message: string;
    status: number;
}

type Nullable<T> = null | T;

interface RouteError {
    message: string;
    status?: number;
}

interface SEOProps {
    /**
     * Title for the page
     */
    title?: string;
}

interface Action<T> {
    type: string;
    payload: T
}

type Store = import("@/context").Store


interface Step {
    /**
     * Content of the step
     */
    body: React.ReactNode;
    /**
     * Data to be displayed in the step's button
     */
    btn?: React.ReactNode;
    /**
     * Custom element to be used in place of the default buttons
     */
    customBtn?: React.ReactNode;
}

type MaterialIcon = import("material-icons").MaterialIcon

/**
 * Props for the <Icon> component
 */
interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
    /**
     * Material icon to be displayed in the component
     */
    icon: MaterialIcon
    /**
     * Icon style
     * 
     * @default "outlined"
     */
    type?: "outlined" | "sharp" | "two-tone" | "default"
}
