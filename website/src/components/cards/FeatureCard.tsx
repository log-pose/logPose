import {BaseCard} from "./BaseCard.tsx";

export const FeatureCard = ({title,subtitle}: {title:string, subtitle: string}) => {
    return(
        <BaseCard>
            <div
                className="text-5xl transition-all duration-300 ease-in-out text-transparent bg-clip-text bg-gradient-to-r from-white/[0.15] to-white/[0.15] group-hover:from-secondary group-hover:to-primary">
                {title}
            </div>
            <div className="text-xl">
                {subtitle}
            </div>
        </BaseCard>
    )
}