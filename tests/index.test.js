const shell = require('shelljs')
jest.doMock('../utils/helper', () => {
  return {
    shouldUpgrade: jest.fn(),
    cleanTemp: jest.fn()
  }
});
jest.doMock('../service/installer-service', () => {
  return {
    install: jest.fn(),
  }
});
const helper = require('../utils/helper');
const service = require('../service/installer-service');
const main = require('../index');
const { afterEachCleanup } = require('./test-utils');

describe('main', () => {

  beforeAll(afterEachCleanup)
  afterEach(afterEachCleanup)
  it('should call install if shouldUpgrade is true', async () => {
    const javac = { stderr: 'test', code: 0}
    const execSpy = jest.spyOn(shell, 'exec');
    execSpy.mockResolvedValue(javac);
    const shouldUpgradeSpy = jest.spyOn(helper, 'shouldUpgrade');
    shouldUpgradeSpy.mockReturnValue(true);
    const installSpy = jest.spyOn(service, 'install');
    installSpy.mockResolvedValue();
    await main();
    expect(shouldUpgradeSpy).toBeCalledWith(javac.stderr, javac.code);
    expect(installSpy).toBeCalled();
    expect(execSpy).toBeCalledWith(`java -version`);
  })
  it('should not call install if shouldUpgrade is false', async () => {
    const javac = { stderr: 'test', code: 0}
    const execSpy = jest.spyOn(shell, 'exec');
    execSpy.mockResolvedValue(javac);
    const shouldUpgradeSpy = jest.spyOn(helper, 'shouldUpgrade');
    shouldUpgradeSpy.mockReturnValue(false);
    const installSpy = jest.spyOn(service, 'install');
    await main();
    expect(shouldUpgradeSpy).toBeCalledWith(javac.stderr, javac.code);
    expect(execSpy).toBeCalled();
    expect(installSpy).not.toBeCalled();
    expect(execSpy).toBeCalledWith(`java -version`);
  })
  it('should throw error if somenthing goes wrong', async () => {
    const javac = { stderr: 'test', code: 0}
    const execSpy = jest.spyOn(shell, 'exec');
    execSpy.mockResolvedValue(javac);
    const shouldUpgradeSpy = jest.spyOn(helper, 'shouldUpgrade');
    shouldUpgradeSpy.mockReturnValue(true);
    const installSpy = jest.spyOn(service, 'install');
    installSpy.mockImplementation(() => { throw Error('test') });
    await expect(main()).rejects.toThrow('test');
    expect(shouldUpgradeSpy).toBeCalledWith(javac.stderr, javac.code);
    expect(execSpy).toBeCalled();
    expect(installSpy).toBeCalled();
    expect(execSpy).toBeCalledWith(`java -version`);
  })
})