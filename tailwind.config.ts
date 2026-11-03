import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: "#121212",
        bgCard: "#1e1e1e",
        borderSubtle: "#2e2e2e",
        tealPrimary: "#008B8B",
        tealSecondary: "#0B8494",
        tealAccent: "#208494",
        textMain: "#F3F4F6",
        textMuted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};
export default config;

