import {useState} from "react";
import {cn} from "./lib/utils.ts";
import {Menu, MenuItem} from "./components/Navbar.tsx";
import {motion} from "framer-motion";
import {HeroHighlight, Highlight} from "./components/HeroHilight.tsx";
import {Section} from "./components/common/Section.tsx";
import {Heading, SubHeading} from "./components/common/Heading.tsx";
import {PricingCard} from "./components/cards/PricingCard.tsx";
import {FeatureCard} from "./components/cards/FeatureCard.tsx";

function App() {
    return (
        <div
            className="h-[200vh] w-full bg-black bg-grid-white/[0.2] flex-col relative flex items-center px-16">
            <div className="absolute pointer-events-none inset-0 flex  items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <Navbar />
            <div className="flex items-center justify-between flex-col z-40 gap-16">

                <Hero className="mt-40" />

                <Features />
                <HeroHighlight>
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: [20, -5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1],
                        }}
                        className="text-5xl px-4 text-white"
                    >
                        Handles multiple{" "}
                        <Highlight className="text-white ">
                            organisations
                        </Highlight>
                        {" "}at same time
                    </motion.h1>
                </HeroHighlight>
                <Pricing/>
            </div>
        </div>
    );

}

export default App

function Features  () {
    return (
        <Section>
            <Heading>Features</Heading>
            <SubHeading>Comprehensive Tools to Optimize, Secure, and Scale Your Server Infrastructure</SubHeading>
            <div className="flex items-center justify-between gap-16 mt-10">
                <FeatureCard title="Real-Time Monitoring" subtitle="Monitor the performance and health of your servers in real-time"/>
                <FeatureCard title="Real-Time Monitoring" subtitle="Monitor the performance and health of your servers in real-time"/>
                <FeatureCard title="Real-Time Monitoring" subtitle="Monitor the performance and health of your servers in real-time"/>
            </div>
        </Section>
    )
}

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div
            className={cn("fixed top-8 inset-x-0 w-full mx-auto z-50 px-16", className)}
        >
            <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Home"/>
                <MenuItem setActive={setActive} active={active} item="Features"/>
                <MenuItem setActive={setActive} active={active} item="Pricing"/>
            </Menu>
        </div>
    );
}

const Pricing = () => {
    return (
            <Section>
                <Heading>Pricing</Heading>
                <SubHeading>LogPose is free for everyone.</SubHeading>
                <div>
                    <PricingCard/>
                </div>
            </Section>
    )
}

const Hero = ({className}: { className?: string}) => {
    return(
        <div className={cn("text-white w-full h-min flex justify-center flex-col items-center", className)}>
            <h1
                className="text-5xl mb-4 bg-gradient-white-primary bg-[length:200%_200%] animate-gradientShift text-transparent bg-clip-text">
                Master Your Server Performance in Real-Time
            </h1>
            <SubHeading>Instant alerts and detailed analytics to keep your infrastructure
                running smoothly.
            </SubHeading>
            <div className="mt-10 flex justify-center gap-7 items-center">

                <button
                    className="px-5 text-sm py-2 bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-3xl hover:bg-black">
                    Get Started
                </button>
                <button
                    className="bg-white rounded-3xl text-black py-2 text-sm px-5 hover:bg-black hover:text-white border border-white">Contact
                    Us
                </button>
            </div>
        </div>
    )
}