// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    // Your other module name mappers...
  },
  transform: {
    // Map JS/JSX/TS/TSX files to the Next.js Babel transformer
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    // No SVG transformer needed here as we're using moduleNameMapper to mock them
  },
  // ...rest of the config
};

module.exports = createJestConfig(customJestConfig);
