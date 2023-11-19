/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "@react-native-community",
    "plugin:react-native-a11y/all",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "jest",
  ],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "eqeqeq": "error",
    "consistent-return": "error",
    "arrow-parens": ["error", "always"],
    "require-await": "off",
    "no-void": ["error", { "allowAsStatement": true }],
    "no-console": "error",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-namespace": ["error", { "allowDeclarations": true }],
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/member-ordering": [
      "error",
      { "interfaces": ["signature", "method", "constructor", "field"] },
    ],
    "@typescript-eslint/method-signature-style": ["error", "method"],
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "@typescript-eslint/no-duplicate-type-constituents": "off",
    "@typescript-eslint/no-redundant-type-constituents": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-misused-promises": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unstable-nested-components": "off",
    "jest/no-disabled-tests": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "parent",
          "sibling",
          "internal",
          "index",
          "type",
          "object",
        ],
        "pathGroups": [
          {
            "pattern": "*expo*",
            "group": "builtin",
            "position": "before",
          },
        ],
        "pathGroupsExcludedImportTypes": ["*expo*"],
        "newlines-between": "always",
      },
    ],
  },
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage",
    "test-results",
    "metro.config.js",
    "babel.config.js",
    "index.js",
  ],
  overrides: [
    {
      files: ["navigation.types.ts"],
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
      },
    },
  ],
  env: {
    "jest/globals": true,
  },
};
