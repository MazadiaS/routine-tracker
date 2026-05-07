import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is set to a repo-relative path during the GitHub Pages build (see the deploy workflow).
// Locally `npm run dev` and `npm run build` keep the default "/" so paths resolve normally.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
});
