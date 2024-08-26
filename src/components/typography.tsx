// TODO replace this with clsx
export const H1 = (
    { children, className, ...props }: React.HTMLAttributes<HTMLElement>
) => {
    return (
        <h1
            {...props}
            className={"text-5xl leading-loose font-bold" + (className ?? "")}
        >
            {children}
        </h1>
    )
}