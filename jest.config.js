module.exports = {
  roots: ['<rootDir>/src/'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '\\.(js|jsx)$': 'babel-jest',
    '\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'clover', 'html'],
  testMatch: ['**/__tests__/**/?(*.)(spec|test).(js|ts)?(x)'],
  verbose: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(js|ts)?(x)',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.d.ts',
  ],
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
  },
};
