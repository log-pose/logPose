import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "logPose",
  description: "monitor you server",
  base: "/docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "Inintialflow", link: "/user-flow" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sebzz2k2/log-pose" },
    ],
  },
});
