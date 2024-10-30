export const BaseCard = ({children}: {children : React.ReactNode})  => {
    return (
        <div className="gap-5 flex flex-col border rounded-lg p-5 bg-white/10 hover:bg-black backdrop-blur-3xl border-white/[0.2]
        text-white/[0.15] hover:text-white/[0.9]
        transition-all duration-300 ease-in-out hover:shadow-rounded hover:drop-shadow-2xl group">
            {children}
        </div>
    )
}