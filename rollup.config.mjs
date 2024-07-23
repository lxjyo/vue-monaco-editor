import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import clear from "rollup-plugin-clear";

export default defineConfig({
  input: "./components/index.ts",
  output: [
    {
      dir: "dist/esm",
      format: "esm",
    },
    {
      dir: "dist/umd",
      format: "umd",
      name: "vueMonaco",
      exports: "named",
      globals: {
        vue: "Vue",
        "@monaco-editor/loader": "monaco_loader",
      },
    },
  ],
  external: ["vue", "monaco-editor", "@monaco-editor/loader"],
  plugins: [
    nodeResolve(),
    commonjs(),
    vue({
      preprocessStyles: true,
    }),
    typescript({
      tsconfig: "tsconfig.app.json",
      useTsconfigDeclarationDir: true,
    }),
    postcss(),
    clear({
      targets: ["dist"],
    }),
  ],
});
