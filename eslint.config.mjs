import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";


const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...pluginQuery.configs["flat/recommended"],
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
