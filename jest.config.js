/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
};