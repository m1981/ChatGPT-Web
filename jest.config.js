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
    // This is the change: map any transformer except SVG to the Next.js Babel transformer
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.svg$': '<rootDir>/node_modules/jest-svg-transformer',
  },
  // ...rest of the config
};

module.exports = createJestConfig(customJestConfig);
