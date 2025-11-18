import { defineConfig } from "tsup";

export default defineConfig({
  treeshake: true,
  dts: true,
  clean: true,
  splitting: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
  sourcemap: true,
});
