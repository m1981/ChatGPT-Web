// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    // Add other mappings for CSS modules if necessary:
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    // Continue your existing mappings here
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    // Add other transformations if necessary
  },
  // Add other Jest configuration options here
};

module.exports = createJestConfig(customJestConfig);
