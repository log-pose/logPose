import React from "react";

export const Heading = ({children}:{children : React.ReactNode}) => {
    return (
        <h2 className="text-5xl mb-4">{children}</h2>
    )
}
export const SubHeading = ({children}:{children : React.ReactNode}) => {
    return (
        <h2 className="text-xl text-gray-500">{children}</h2>
    )
}
