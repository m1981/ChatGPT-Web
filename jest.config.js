module.exports = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-jsdom",

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)"
  ],

  // Path to a file which will be executed before starting the test run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },

  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // A map from regular expressions to module names or to arrays of module names
  // that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
  }
};
