import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import tseslint from 'typescript-eslint';

export default [
  // =====================
  // IGNORÉS (OBLIGATOIRE)
  // =====================
  {
    ignores: [
      '**/node_modules/**',
      '**/.angular/**',
      '**/dist/**',
      '**/public/**',
      'src/*.html',
      'src/app/app.html'
    ]
  },

  // =====================
  // TypeScript Angular
  // =====================
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser
    },
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@angular-eslint/prefer-inject': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ]
    }
  },

  // =====================
  // Templates Angular UNIQUEMENT
  // =====================
  {
    files: ['**/*.component.html'],
    languageOptions: {
      parser: angularTemplate.parser
    },
    plugins: {
      '@angular-eslint/template': angularTemplate
    },
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'off'
    }
  },

  // =====================
  // Tests
  // =====================
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
