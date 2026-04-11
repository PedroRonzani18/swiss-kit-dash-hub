// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { createUnusedVarsRule } from '@swisskit/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'prisma/**/*.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['jest.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // === Regras de TypeScript (Critérios Médios) ===
      '@typescript-eslint/no-explicit-any': 'warn', // Permite any mas avisa
      '@typescript-eslint/no-unused-vars': createUnusedVarsRule(),
      '@typescript-eslint/explicit-function-return-type': 'off', // Muito restritivo
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Muito restritivo
      '@typescript-eslint/no-floating-promises': 'warn', // Importante para async/await
      '@typescript-eslint/require-await': 'off', // Desabilitado - métodos async podem ser preparatórios
      '@typescript-eslint/unbound-method': 'off', // Relaxado para métodos estáticos

      // === Regras de Segurança TypeScript (Relaxadas) ===
      '@typescript-eslint/no-unsafe-assignment': 'off', // Muito restritivo para desenvolvimento
      '@typescript-eslint/no-unsafe-member-access': 'off', // Muito restritivo
      '@typescript-eslint/no-unsafe-return': 'off', // Muito restritivo
      '@typescript-eslint/no-unsafe-argument': 'off', // Muito restritivo
      '@typescript-eslint/restrict-template-expressions': 'off', // Muito restritivo

      // === Regras JavaScript Essenciais ===
      'prefer-const': 'error', // Importante para performance
      'no-var': 'error', // Essencial - usar let/const
      'no-console': 'warn', // Avisar mas não bloquear (útil para debug)
      eqeqeq: 'error', // Sempre usar === e !==
      curly: 'error', // Sempre usar chaves em blocos
      'no-unused-vars': 'off', // Usar a versão do TypeScript

      // === Regras de Qualidade de Código ===
      'no-case-declarations': 'off', // Relaxado para switch statements
      'no-empty': 'warn', // Avisar sobre blocos vazios
      'no-unreachable': 'error', // Código inalcançável é erro
      'no-duplicate-case': 'error', // Cases duplicados são erro

      // === Regras de Estilo (Flexíveis) ===
      quotes: ['warn', 'single', { allowTemplateLiterals: true }], // Preferir aspas simples
      semi: ['warn', 'always'], // Sempre usar ponto e vírgula
      'comma-dangle': ['warn', 'always-multiline'], // Vírgula no final em multilinha

      // === Regras Específicas para NestJS ===
      '@typescript-eslint/interface-name-prefix': 'off', // Permitir prefixo I
      '@typescript-eslint/no-empty-function': 'off', // Permitir funções vazias (útil para interfaces)
    },
  },
  {
    // Configurações específicas para arquivos de teste
    files: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Mais flexível em testes
      'no-console': 'off', // Permitir console em testes
      '@typescript-eslint/no-unused-vars': 'off', // Mais flexível em testes
    },
  },
  {
    // Configurações específicas para arquivos de configuração
    files: ['**/*.config.ts', '**/*.config.js', '**/*.config.mjs'],
    rules: {
      'no-console': 'off', // Permitir console em configs
      '@typescript-eslint/no-require-imports': 'off', // Permitir require em configs
    },
  },
  {
    // Configurações específicas para arquivos de seed
    files: ['**/seed.ts', '**/seed.js'],
    rules: {
      'no-console': 'off', // Permitir console em seeds
      '@typescript-eslint/no-require-imports': 'off', // Permitir require em seeds
    },
  },
);
