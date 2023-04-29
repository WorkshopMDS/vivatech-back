module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public', 'jest.config.js'],
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  rules: {
    /*
     * Default ESLint rules
     */
    'no-useless-catch': 'off',

    'require-yield': 'off',

    // We always prefer `const` to `let` if the variables aren't reassigned.
    'prefer-const': 'error',

    // Allow using the old `arguments` global, as it's used in some old code.
    'prefer-rest-params': 'error',

    // Allow using declaration inside case
    'no-case-declarations': 'error',

    // Disable a few arbitrary/overkill rules
    'require-atomic-updates': 'off',
    'no-prototype-builtins': 'off',

    'max-classes-per-file': 'off',

    // Allow the eslint autofixer to fix trailing spaces
    'no-trailing-spaces': 'error',

    // Returning nothing from callback is OK
    'array-callback-return': ['error', { allowImplicit: true }],

    'no-unused-vars': ['error', { ignoreRestSiblings: true }],

    // Allow "useless" escape of characters in RegExp; could be false-positive
    'no-useless-escape': 'off',

    // Restrict find as a global because for us it's lodash function not the
    // browser one
    // Restrict location as a global to force devs to use window.location
    'no-restricted-globals': ['error', 'find', 'close', 'name', 'location'],

    // Emit an error on useless expressions
    // (like when we forgot to add () at the end of functions)
    'no-unused-expressions': 'error',

    // Error when we return while await-ing a Promise
    'no-return-await': 'error',

    // Error when forgetting object-shorthand
    'object-shorthand': 'error',

    // Disallow using an async function as a Promise executor
    'no-async-promise-executor': 'error',

    'arrow-body-style': ['error', 'as-needed'],

    /*
     * Typescript rules
     */
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],

    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],

    // Allow using `require()` instead of `import` (in scripts mostly).
    '@typescript-eslint/no-var-requires': 'off',

    // Do not require an explicit return type on functions, as it can be
    // inferred most of the time.
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Same as above for exported functions
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // We don't want to error when using a function before its definition, as it
    // is our current recommended way of ordering functions in a file.
    '@typescript-eslint/no-use-before-define': 'off',

    '@typescript-eslint/naming-convention': [
      'error',
      // There is no way to distinguish a JSX component from a regular function
      // so we allow both camelCase and PascalCase for function declarations.
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      // Same goes for variables.
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      { selector: 'class', format: ['PascalCase'], leadingUnderscore: 'allow' },
      { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      { selector: 'enum', format: ['PascalCase'] },
    ],

    // Forbid assigning `this` to a variable, except to `appDependencyResolver`,
    // which is sometimes done for a legitimate reason.
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowedNames: ['appDependencyResolver'],
      },
    ],

    // We allow the empty interface for example the ones which are just alias
    '@typescript-eslint/no-empty-interface': 'off',

    // We don't really care whether empty functions are declared with a regular
    // function syntax, or with an arrow function one.
    '@typescript-eslint/no-empty-function': 'off',

    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/member-ordering': 'off',

    /*
     * Import rules
     */

    // Do not throw an error on `import * as ... from ...`
    'import/namespace': ['error', { allowComputed: true }],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // Do not warn against doing `import bar from 'foo'` when bar is also
    // a named export in foo.js
    'import/no-named-as-default': 'off',

    // Do not warn against doing `ChartPanel.TEMPLATES` when ChartPanel
    // also has a `TEMPLATES` named export
    'import/no-named-as-default-member': 'off',

    'import/prefer-default-export': 'off',

    // Define how imports should be grouped/sorted
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'unknown', // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: 'asc',
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],

    // The code value is just necessary as to avoid false positive from eslint
    // Prettier will override this value, and apply this rationale:
    // https://prettier.io/docs/en/rationale.html#print-width
    'max-len': [
      'error',
      {
        comments: 80,
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
      },
    ],
  },
};
