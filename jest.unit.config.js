module.exports = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/jdk/',
    '/temp/',
    '/coverage/',
  ],
  testMatch: ['<rootDir>/tests/**/?(*.)+(test).js'],
  automock: false,
  verbose: true,
  coverageReporters: ['text-summary', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
      "./**/*.js",
      "!*.*.config.js"
  ],
  collectCoverage: true
};