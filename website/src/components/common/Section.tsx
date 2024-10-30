import React from "react";

export const Section = ({children}: {children : React.ReactNode}) => {
    return (
        <section className="flex flex-col text-white items-center">
            {children}
        </section>

    )
}