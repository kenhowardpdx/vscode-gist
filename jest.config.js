module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/(*.)+(spec|test).ts?(x)'],
  coverageThreshold: {
    global: {
      branches: 68, // TODO: adjust this back to 80%
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
