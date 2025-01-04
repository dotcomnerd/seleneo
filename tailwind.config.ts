const { fontFamily } = require("tailwindcss/defaultTheme");
// theme: {
//     container: {
//         center: true,
//             padding: "1.5rem",
//                 screens: {
//             xlg: "100%",
//       },
//     },
//     extend: {
//         screens: {
//             xlg: "1100px",
//       },
//         backgroundColor: {
//             primary: "#FBFBFA",
//                 secondaryLight: "#F1F4F4",
//                     dark: "#181819",
//                         formDark: "hsl(216, 9%, 11%)",
//                             sidebar: "#151515",
//       },
//         textColor: {
//             primary: "#212329",
//                 dark: "#C2C3C9",
//                     purple: "#898AEB",
//       },
// /** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
                "xlg": "100%"
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                blob: {
                    '0%': {
                      transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                      transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                      transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                      transform: 'translate(0px, 0px) scale(1)',
                    },
                  },
                  float: {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-20px)',
                    },
                  },
                "shiny-text": {
                    "0%, 90%, 100%": {
                        "background-position": "calc(-100% - var(--shiny-width)) 0",
                    },
                    "30%, 60%": {
                        "background-position": "calc(100% + var(--shiny-width)) 0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                blob: 'blob 7s infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-fast': 'float 4s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 2s',
                "shiny-text": "shiny-text 8s infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
