module.exports = {
  // Basic settings, mainly for .cjs config files
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended'],

  // React with TypeScript overrides
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
      ],
    },
  ],
};
