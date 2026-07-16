import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D60000",
          dark: "#111111",
          text: "#222222",
          light: "#F7F7F7",
          border: "#E5E5E5",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      borderRadius: {
        section: "12px",
        card: "16px",
        button: "10px",
      },
      spacing: {
        "section-desktop": "100px",
        "section-tablet": "70px",
        "section-mobile": "50px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        fadeLeft: "fadeLeft 0.6s ease-out forwards",
        fadeRight: "fadeRight 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
