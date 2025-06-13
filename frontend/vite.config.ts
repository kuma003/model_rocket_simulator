import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig(({mode}) => ({
  base: mode === "production" ? "/model_rocket_simulator/" : undefined,
  plugins: [
    !isStorybook && reactRouter(), tsconfigPaths()],
  // server: {
  //   port: 5173,
  //   strictPort: true,
  //   host: "0.0.0.0",
  // },
}));
