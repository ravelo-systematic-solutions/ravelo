module.exports = {
  coverage: true,
  leaks: false,
  verbose: true,
  reporter: ['console', 'html', 'lcov', 'json'],
  output: ['stdout', 'coverage/coverage.html', 'coverage/lcov.info', 'coverage/data.json']
};