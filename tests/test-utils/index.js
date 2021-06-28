const { cleanTemp } = require('../../utils/helper');

const afterEachCleanup = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  cleanTemp();
}

module.exports = {
  afterEachCleanup
}