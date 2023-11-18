// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Specify the base directory of your project
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Location of your jest.setup.js file
  testEnvironment: 'jest-environment-jsdom', // Use jsdom environment
  moduleNameMapper: {
    // Handle CSS imports (assuming you have CSS modules)
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Handle image imports, if necessary
    '\\.(jpg|jpeg|png|gif|webp|avif)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock SVGs
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js', // Adjusted to match your mock file path
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // This is necessary for next.js projects
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // Ignore certain folders from being tested
  collectCoverageFrom: ['<rootDir>/app/components/**/*.tsx', '!<rootDir>/node_modules/', '!<rootDir>/.next/'], // Collect coverage from files, if necessary
};

// Create the Jest config with the next/jest preset and your custom configuration
module.exports = createJestConfig(customJestConfig);
