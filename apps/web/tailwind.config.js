const path = require('path');

module.exports = {
  content: [
    path.resolve(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'index.html'),
    path.resolve(__dirname, '../../libs/ui/src/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/app/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/components/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/pages/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/services/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/types/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'src/widgets/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
