import type { Config } from "tailwindcss";
import sharedConfig from "@logpose/tailwind-config";

const config: Pick<Config, "presets" | "content" | "theme" | "prefix"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
  prefix: "ui-",
};

export default config;
