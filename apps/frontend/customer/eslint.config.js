import { nextJsConfig } from "@repo/eslint-config/next-js";
import reactCompiler from "eslint-plugin-react-compiler";

export default [
  ...nextJsConfig,
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-compiler/react-compiler": "error",
    },
  },
];
