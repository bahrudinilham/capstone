module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#07a081",
          soft: "#ccf5ea",
        },
      },
      boxShadow: {
        card: "0 15px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
