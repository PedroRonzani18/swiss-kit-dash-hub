import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { createUnusedVarsRule } from "@swisskit/eslint-config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": createUnusedVarsRule({ ignoreRestSiblings: true }),
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@radix-ui/*"],
              message:
                "Importe Radix apenas em src/components/ui. Fora disso, use wrappers de @/components/ui.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/ui/**/*.tsx", "src/auth/AuthContext.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
      "no-restricted-imports": "off",
    },
  },
);
