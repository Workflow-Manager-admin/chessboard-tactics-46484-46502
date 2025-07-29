module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e42",
      },
      fontFamily: {
        sans: 'var(--font-geist-sans), Arial, Helvetica, sans-serif',
        mono: 'var(--font-geist-mono), monospace',
      }
    },
  },
  plugins: [],
};
