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
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*"],
              message:
                "Features não devem depender de modules/pages. Extraia contratos para camadas compartilhadas (src/lib, src/components, src/auth).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/animes/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/finance/*", "@/modules/settings/*", "@/modules/tools/*"],
              message:
                "Módulos não devem importar entre si. Mova código compartilhado para src/modules/shared, src/components ou src/lib.",
            },
            {
              group: ["@/features/*"],
              message:
                "O módulo Animes não deve depender de features de outros domínios. Use apenas suas próprias estruturas de módulo ou camadas compartilhadas.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/tools/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/animes/*", "@/modules/finance/*", "@/modules/settings/*"],
              message:
                "Módulos não devem importar entre si. Mova código compartilhado para src/modules/shared, src/components ou src/lib.",
            },
            {
              group: ["@/features/*"],
              message:
                "O módulo Ferramentas não deve depender de features de outros domínios. Use apenas suas próprias estruturas de módulo ou camadas compartilhadas.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/settings/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/animes/*", "@/modules/finance/*", "@/modules/tools/*"],
              message:
                "Módulos não devem importar entre si. Mova código compartilhado para src/modules/shared, src/components ou src/lib.",
            },
            {
              group: ["@/features/*"],
              message:
                "O módulo Configurações não deve depender de features de outros domínios. Use apenas suas próprias estruturas de módulo ou camadas compartilhadas.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/finance/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/animes/*", "@/modules/settings/*", "@/modules/tools/*"],
              message:
                "Módulos não devem importar entre si. Mova código compartilhado para src/modules/shared, src/components ou src/lib.",
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
