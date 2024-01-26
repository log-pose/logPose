import React, { FC, ReactNode, useMemo } from "react";
import { cn } from "./lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline";
  kind?: "primary" | "secondary";
  children: ReactNode;
};

const defaultProps: ButtonProps = {
  size: "md",
  variant: "filled",
  kind: "primary",
  children: null,
};

const Button: FC<ButtonProps> = ({
  size,
  variant,
  kind,
  children,
  ...rest
}) => {
  const getSizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "text-sm px-4 py-2";
      case "md":
        return "text-base px-6 py-2";
      case "lg":
        return "text-lg px-8 py-4";
      default:
        return "text-base px-6 py-3";
    }
  }, [size]);

  const getVariantClass = useMemo(() => {
    const primaryFilled =
      "bg-primary-500 hover:bg-primary-400 focus:bg-primary-500 text-white";
    const primaryOutline = "border border-primary-500 text-primary-500";
    const secondaryFilled =
      "bg-secondary-800 hover:bg-secondary-700 focus:bg-secondary-900 text-white";
    const secondaryOutline = "border border-secondary-900 text-secondary-900";

    if (kind === "primary") {
      return variant === "filled" ? primaryFilled : primaryOutline;
    } else if (kind === "secondary") {
      return variant === "filled" ? secondaryFilled : secondaryOutline;
    }

    return "";
  }, [kind, variant]);

  const buttonClass = cn("rounded", getSizeClass, getVariantClass);

  return (
    // <button className={buttonClass} {...rest}>
    //   {children}
    // </button>
    <button className="ui-bg-black">{children}</button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
