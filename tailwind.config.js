/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C5DD3", // Benepass purple
        secondary: "#F8F7FF", // light lilac background
        accent: "#FFB347", // warm accent (optional)
        brandRed: "#E53935", // Benepass red (added)
        text: {
          primary: "#1E1E1E",
          secondary: "#6B7280",
        },
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
}
