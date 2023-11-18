// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  // ... rest of the config
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js', // Add this line to redirect SVG imports
    // ... other mappings (if any)
  },
  // ... rest of the config
};

module.exports = createJestConfig(customJestConfig);
