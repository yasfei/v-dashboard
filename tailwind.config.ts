import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#222729",
        input: "#131516",
        button: "#1B3F1B",
      },
      fontFamily: {
        sans: ['"Red Hat Display"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
