import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/commons/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Blue colors (Primary) - Figma Foundation
        blue: {
          50: '#F0F7FF',
          100: '#DBEEFF',
          200: '#BDDBFF',
          300: '#93BEFF',
          400: '#6DA5FA',
          500: '#497CFF',
          600: '#3A5CF3',
          700: '#274AE1',
          800: '#1530A6',
          900: '#0B2184',
        },
        
        // Gray colors (Neutral) - Figma Foundation
        gray: {
          0: '#FFFFFF',
          50: '#F2F2F2',
          100: '#E4E4E4',
          200: '#D4D3D3',
          300: '#C7C7C7',
          400: '#ABABAB',
          500: '#919191',
          600: '#777777',
          700: '#5F5F5F',
          800: '#333333',
          900: '#1C1C1C',
          950: '#000000',
        },
        
        // Red colors (Error) - Figma Foundation
        red: {
          50: '#FDD7DC',
          100: '#F797A4',
          200: '#F4677A',
          300: '#F03851',
          400: '#E4112E',
          500: '#B40E24',
          600: '#850A1B',
        },
        
        // Green colors (Success) - Figma Foundation
        green: {
          50: '#D3F3E0',
          100: '#92E6B9',
          200: '#15D66F',
          300: '#12B75F',
          400: '#109C51',
          500: '#0E723C',
          600: '#084424',
        },
        
        // Yellow colors (Warning) - Figma Foundation
        yellow: {
          50: '#FFE499',
          100: '#FFD666',
          200: '#FFC933',
          300: '#FFB300',
          400: '#EBA500',
          500: '#D69600',
          600: '#B27D00',
        },
        
        // Cool Gray - Figma Foundation
        coolGray: {
          10: '#F8F8FA',
          50: '#F6F6F9',
          100: '#EDEEF2',
          200: '#DDDFE5',
          300: '#D2D4DD',
          400: '#C7C9D5',
          500: '#BBBECD',
          600: '#B0B3C4',
        },
      },
    },
  },
  plugins: [],
};
export default config;
