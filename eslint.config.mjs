import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "node_modules/**", // 👈 Added to ensure dependency paths are explicitly isolated from lint passes
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;