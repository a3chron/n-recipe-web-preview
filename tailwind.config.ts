import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        plex: ["IBM Plex Mono", "Menlo", "monospace"],
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms")],
};
export default config;
