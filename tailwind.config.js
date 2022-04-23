module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2aa090",
        "primary-dark": "#23877a",
      },
    },
    fontFamily: { sans: ["Pretendard Variable"] },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
