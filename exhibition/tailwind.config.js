/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "river-start": "url('/river-start.svg')",
        "river-follow-1": "url('/river-follow-1.svg')",
        "river-follow-2": "url('/river-follow-2.svg')",
        "river-end": "url('/river-end.svg')",
      },
      colors: {
        primary: "#00c6a1ff",
      },
    },
  },
  plugins: [],
};
