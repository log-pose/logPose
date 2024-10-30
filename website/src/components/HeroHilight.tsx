import { cn } from "../lib/utils";
import { useMotionValue, motion } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
                                  children,
                                  className,
                                  containerClassName,
                              }: {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({
                                 currentTarget,
                                 clientX,
                                 clientY,
                             }: React.MouseEvent<HTMLDivElement>) {
        if (!currentTarget) return;
        let { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (
        <div
            className={cn(
                "relative h-min flex items-center z-40 justify-center w-full group text-white",
                containerClassName
            )}
            onMouseMove={handleMouseMove}
        >
            <div className="absolute inset-0   pointer-events-none" />
          {/*  <motion.div*/}
          {/*      className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"*/}
          {/*      style={{*/}
          {/*          WebkitMaskImage: useMotionTemplate`*/}
          {/*  radial-gradient(*/}
          {/*    200px circle at ${mouseX}px ${mouseY}px,*/}
          {/*    black 0%,*/}
          {/*    transparent 100%*/}
          {/*  )*/}
          {/*`,*/}
          {/*          maskImage: useMotionTemplate`*/}
          {/*  radial-gradient(*/}
          {/*    200px circle at ${mouseX}px ${mouseY}px,*/}
          {/*    black 0%,*/}
          {/*    transparent 100%*/}
          {/*  )*/}
          {/*`,*/}
          {/*      }}*/}
          {/*  />*/}

            <div className={cn("relative z-40", className)}>{children}</div>
        </div>
    );
};

export const Highlight = ({
                              children,
                              className,
                          }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.span
            initial={{
                backgroundSize: "0% 100%",
            }}
            animate={{
                backgroundSize: "100% 100%",
            }}
            transition={{
                duration: 2,
                ease: "linear",
                delay: 0.5,
            }}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                display: "inline",
            }}
            className={cn(
                `relative inline-block pb-1   px-1 rounded-lg bg-gradient-to-r from-primary to-secondary text-white `,
                className
            )}
        >
            {children}
        </motion.span>
    );
};
