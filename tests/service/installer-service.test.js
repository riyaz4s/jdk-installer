const { afterEachCleanup } = require('../test-utils')
jest.doMock('../../api/zulu-api', () => {
  return {
    fetchJdkBundle: jest.fn(),
  }
});
jest.doMock('../../utils/helper', () => {
  return {
    getOsType: jest.fn(),
    downloadFile: jest.fn(),
    installFile: jest.fn(),
    updateJavaHome: jest.fn(),
    cleanTemp: jest.fn(),
  }
});
const helper = require('../../utils/helper');
const api = require('../../api/zulu-api');
const { install } = require('../../service/installer-service');
const { constants: { OS }, constants: { FOLDERS } } = require('../../constants');


describe('installer', () => {

  afterEach(afterEachCleanup)
  it('should throw error if no jdk found', async () => {
    const getOsTypeSpy = helper.getOsType;
    getOsTypeSpy.mockResolvedValue(OS.WIN);
    const downloadFileSpy = helper.downloadFile;
    downloadFileSpy.mockResolvedValue({});
    const fetchJdkBundleSpy = api.fetchJdkBundle
    fetchJdkBundleSpy.mockResolvedValue({ data: [] });
    await expect(install()).rejects.toThrow(`Required jdk not found. Required`);
    expect(getOsTypeSpy).toBeCalled();
    expect(downloadFileSpy).not.toBeCalled();
    expect(fetchJdkBundleSpy).toBeCalledWith({
      jdkVersion: '11.0',
      javaVersion: '11.0',
      zuluVersion: '11.33',
      os: 'windows',
      ext: 'zip'
    });
  })
  it('should download if no jdk found', async () => {
    const getOsTypeSpy = helper.getOsType;
    getOsTypeSpy.mockResolvedValue(OS.WIN);
    const downloadFileSpy = helper.downloadFile;
    downloadFileSpy.mockResolvedValue({});
    const installFileSpy = helper.installFile;
    installFileSpy.mockResolvedValue({});
    const updateJavaHomeSpy = helper.updateJavaHome;
    updateJavaHomeSpy.mockResolvedValue({});
    const fetchJdkBundleSpy = api.fetchJdkBundle
    fetchJdkBundleSpy.mockResolvedValue({ data: [{ name: '1.zip', url: 'test.com' }] });
    await install();
    expect(getOsTypeSpy).toBeCalled();
    expect(downloadFileSpy).toBeCalled();
    expect(updateJavaHomeSpy).toBeCalledWith('1');
    expect(installFileSpy).toBeCalledWith(OS.WIN, '1.zip');
    expect(fetchJdkBundleSpy).toBeCalledWith({
      jdkVersion: '11.0',
      javaVersion: '11.0',
      zuluVersion: '11.33',
      os: 'windows',
      ext: 'zip'
    });
  })


});
