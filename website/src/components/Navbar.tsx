"use client";
import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/img/logo_32.png"

export const MenuItem = ({
                             setActive,
                             active,
                             item,
                         }: {
    setActive: (item: string) => void;
    active: string | null;
    item: string;
}) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative ">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer hover:text-primary text-white text-lg"
            >
                {item}
            </motion.p>
            {active !== null && (
              <></>
            )}
        </div>
    );
};

export const Menu = ({
                         setActive,
                         children,
                     }: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {

    return (
        <>
            <nav
                onMouseLeave={() => setActive(null)} // resets the state
                className="relative rounded-full border bg-black border-white/[0.2] bg-white/10 backdrop-blur-5xl  shadow-input flex justify-between  px-16 py-6 "
            >
                <img
                    src={logo}
                 alt={"Log Pose Logo"}/>
                <div className="flex items-center justify-between space-x-16">
                {children}
                </div>
                <div className="text-white">Sign Up</div>
            </nav>
        </>
    );
};

