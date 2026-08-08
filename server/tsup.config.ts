import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.test.ts", "!src/migrations/*"],
  onSuccess: "tsc-alias -p ./tsconfig.build.json",
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  tsconfig: "./tsconfig.build.json",
  bundle: false,
});
