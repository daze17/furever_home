import reactCompiler from "eslint-plugin-react-compiler";

import { nextJsConfig } from "@repo/eslint-config/next-js";

export default [
  ...nextJsConfig,
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      // React.FCC etc causes errors
      "react/prop-types": "off",

      "no-unused-vars": "off",
      "@typescript-eslint/internal/no-poorly-typed-ts-props": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-compiler/react-compiler": "error",
    },
  },
];
