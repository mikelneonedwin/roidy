const Icon = ({ icon, type = "outlined", ...props }: IconProps) => {
    return (
        <span
            {...props}
            className={`material-icons${type !== "default" ? "-" + type : ""} ${props.className ?? ""}`}
        >
            {icon}
        </span>
    )
}

export default Icon;