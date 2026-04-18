import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { createUnusedVarsRule } from "@swisskit/eslint-config";
import tseslint from "typescript-eslint";

const featureToModuleBoundaryPattern = {
  group: ["@/modules/*"],
  message:
    "Features não devem depender de modules/pages. Extraia contratos para camadas compartilhadas (src/lib, src/components, src/auth).",
};

const radixAndLegacyComponentPatterns = [
  {
    group: ["@radix-ui/*"],
    message:
      "Importe Radix apenas em src/components/ui. Fora disso, use wrappers de @/components/ui.",
  },
  {
    group: ["@/components/finance/*"],
    message:
      "Componentes de domínio financeiro devem viver em src/features/finance/components.",
  },
];

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
    ignores: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: radixAndLegacyComponentPatterns,
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
          patterns: [featureToModuleBoundaryPattern],
        },
      ],
    },
  },
  {
    files: ["src/{app,auth,components,modules,pages}/**/*.{ts,tsx}", "src/*.{ts,tsx}"],
    ignores: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...radixAndLegacyComponentPatterns,
            {
              group: ["@/features/finance/*", "@/features/finance/*/**"],
              message:
                "Camadas fora da feature devem importar apenas pela API pública: @/features/finance.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/features/finance/components/**/*.{ts,tsx}",
      "src/features/finance/hooks/**/*.{ts,tsx}",
      "src/features/finance/model/**/*.{ts,tsx}",
      "src/features/finance/FinanceModuleContent.tsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            featureToModuleBoundaryPattern,
            {
              group: [
                "@/api/accounts",
                "@/api/categories",
                "@/api/subcategories",
                "@/api/transactions",
                "@/api/queryKeys",
              ],
              message:
                "Use a camada de acesso de dados da própria feature: @/features/finance/api.",
            },
            {
              group: ["@/features/finance/services", "@/features/finance/services/*"],
              message:
                "A camada services foi descontinuada. Use @/features/finance/api.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/finance/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            featureToModuleBoundaryPattern,
            {
              group: [
                "@/features/finance/components/**",
                "@/features/finance/hooks/**",
              ],
              message:
                "A camada de API deve ser independente de UI e hooks da feature.",
            },
            {
              group: ["@/features/finance/services", "@/features/finance/services/*"],
              message:
                "A camada services foi descontinuada. Use @/features/finance/api.",
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
    },
  },
);
