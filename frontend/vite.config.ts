import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({mode}) => ({
  base: mode === "production" ? "/model_rocket_simulator/" : undefined,
  plugins: [reactRouter(), tsconfigPaths()],
  // server: {
  //   port: 5173,
  //   strictPort: true,
  //   host: "0.0.0.0",
  // },
}));
