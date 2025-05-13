import daisyui from "daisyui";
import { themes } from "daisyui/src/theming/themes.js";

export default {
  plugins: [daisyui],

  theme: {
    extend: {
      colors: {
        "primary-muted": "oklch(var(--primary-muted) / <alpha-value>)",
      },
    },
  },

  daisyui: {
    themes: [
      {
        light: {
          ...themes.light,
          "--primary-muted": "65% 0.2 295",
        },
      },
    ],
  },
};