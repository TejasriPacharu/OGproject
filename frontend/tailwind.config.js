module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f0ff",
          100: "#bdd6ff",
          200: "#94bcff",
          300: "#6aa2ff",
          400: "#4188ff",
          500: "#176eff",
          600: "#0063ff",
          700: "#0050cc",
          800: "#003e99",
          900: "#002c66",
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(108, 99, 255, 0.2)',
      },
      fontFamily: {
        code: ['"Source Code Pro"', "monospace"],
        press: ['"Press Start 2P"', "system-ui"],
      },
    },
  },
  plugins: [],
};
