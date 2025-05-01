module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next"],
  plugins: ["react-compiler"],
  rules: {
    "no-unused-vars": "off",
    "react-compiler/react-compiler": "error",
  },
};
