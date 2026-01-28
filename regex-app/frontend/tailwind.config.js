/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        glow: "0 0 0 3px rgba(147, 51, 234, 0.25)",
      },
      backgroundImage: {
        'grid': "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '16px 16px',
      },
    },
  },
  plugins: [],
}
