module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/utils/logger.js'
  ],
  coverageReporters: ['text', 'lcov'],
  testTimeout: 10000,
  setupFilesAfterEnv: ['./tests/setup.js']
}; 