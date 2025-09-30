/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  // transform: {
  //   '^.+.tsx?$': ['ts-jest', {}],
  // },
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!**/node_modules/**'],
  testTimeout: 30000,
};
