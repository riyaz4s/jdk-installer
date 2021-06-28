const shell = require('shelljs');
const { constants: { OS }, constants: { FOLDERS } } = require('../../constants');
const { getOsType,
  downloadFile,
  installFile,
  shouldUpgrade,
  updateJavaHome,
} = require('../../utils/helper');
const { afterEachCleanup } = require('../test-utils')


describe('helper.js', () => {

  afterEach(afterEachCleanup)
  describe('getOsType', () => {
    it('should return os type based on uname output', async () => {
      let op = { stderr: 'darwin' }
      const mock = jest.spyOn(shell, 'exec');
      mock.mockResolvedValue(op);
      let result = await getOsType();
      expect(result).toBe(OS.OSX);

      op = { stderr: 'linux-gnu' }
      mock.mockResolvedValue(op);
      result = await getOsType();
      expect(result).toBe(OS.LINUX);

      op = { stderr: 'cygwin' }
      mock.mockResolvedValue(op);
      result = await getOsType();
      expect(result).toBe(OS.WIN)

    })
    it('should throw error if unsupported os', async () => {
      const op = { stderr: 'test' }
      const mock = jest.spyOn(shell, 'exec');  // spy on fs.readFileSync()
      mock.mockResolvedValue(op);
      await expect(getOsType()).rejects.toThrow('Unsupportd version');
    })
  })

  describe('downloadFile', () => {

    afterEach(afterEachCleanup)
    it('should download file from given url and save to the given path', async () => {
      let op = { stderr: 'darwin' }
      const url = 'testurl.com';
      const path = 'testPath';
      const mkdirSpy = jest.spyOn(shell, 'mkdir');
      const cdSpy = jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      execSpy.mockResolvedValue(op);
      mkdirSpy.mockResolvedValue(op);
      cdSpy.mockResolvedValue(op);
      let result = await downloadFile(url, path);
      expect(mkdirSpy).toBeCalledWith(path);
      expect(cdSpy).toBeCalledWith(path);
      expect(execSpy).toBeCalledWith(`wget ${url}`);
    })
    it('should download file from given url and save to the default path', async () => {
      let op = { stderr: 'darwin' }
      const url = 'testurl.com';
      const path = FOLDERS.download;
      const mkdirSpy = jest.spyOn(shell, 'mkdir');
      const cdSpy = jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      execSpy.mockResolvedValue(op);
      let result = await downloadFile(url);
      expect(mkdirSpy).toBeCalledWith(path);
      expect(cdSpy).toBeCalledWith(path);
      expect(execSpy).toBeCalledWith(`wget ${url}`);
    })
    it('should throw error if download failes', async () => {
      jest.spyOn(shell, 'mkdir');
      jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      execSpy.mockImplementation(() => { throw Error('test') });
      await expect(downloadFile()).rejects.toThrow('test');
    })
  })

  describe('installFile', () => {

    afterEach(afterEachCleanup)
    it('should install file from given url and save to the given path', async () => {
      const file = '1.tar.gz'
      let os = OS.OSX;
      const url = 'testurl.com';
      const path = FOLDERS.install;
      const mkdirSpy = jest.spyOn(shell, 'mkdir');
      const cdSpy = jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      await installFile(os, file);
      expect(mkdirSpy).toBeCalledWith(path);
      expect(cdSpy).toBeCalledWith(path);
      expect(execSpy).toBeCalledWith(`tar -xzvf ${FOLDERS.download}/${file}`);
    })

    it('should install file from given url and save to the given path - win', async () => {
      const file = '1.tar.gz'
      let os = OS.WIN;
      const path = FOLDERS.install;
      const mkdirSpy = jest.spyOn(shell, 'mkdir');
      const cdSpy = jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      await installFile(os, file);
      expect(mkdirSpy).toBeCalledWith(path);
      expect(cdSpy).toBeCalledWith(path);
      expect(execSpy).toBeCalledWith(`${FOLDERS['7zip']} e ${FOLDERS.download}/${file}`);
    })
    it('should throw error if install failes', async () => {
      let op = { stderr: 'darwin' }
      jest.spyOn(shell, 'mkdir');
      jest.spyOn(shell, 'cd');
      const execSpy = jest.spyOn(shell, 'exec');
      execSpy.mockImplementation(() => { throw Error('test') });
      await expect(installFile()).rejects.toThrow('test');
    })
  })

  describe('shouldUpgrade', () => {

    afterEach(afterEachCleanup)
    it('should check if upgrade is needed', async () => {
      let code = 0;
      let result = `OpenJDK version "11.0_232"
      OpenJDK Runtime Environment (Zulu 11.42.0.14-SA-macosx) (build 1.8.0_232-b18)
      OpenJDK 64-Bit Server VM (Zulu 8.42.0.14-SA-macosx) (build 25.232-b18, mixed mode)`
      expect(shouldUpgrade(result, code)).toBeFalsy();

      result = `openjdk version "1.8.0_232"
      OpenJDK Runtime Environment (oracle 8.42.0.14-SA-macosx) (build 1.8.0_232-b18)
      OpenJDK 64-Bit Server VM (oracle 6.42.0.14-SA-macosx) (build 25.232-b18, mixed mode)`
      expect(shouldUpgrade(result, code)).toBeTruthy();

      result = `OpenJDK version "1.6.0_232"
      OpenJDK Runtime Environment (Zulu 6.42.0.14-SA-macosx) (build 1.8.0_232-b18)
      OpenJDK 64-Bit Server VM (Zulu 8.42.0.14-SA-macosx) (build 25.232-b18, mixed mode)`
      expect(shouldUpgrade(result, code)).toBeTruthy();

      result = `OpenJDK version "11.0_232"
      OpenJDK Runtime Environment (Zulu 11.42.0.14-SA-macosx) (build 1.8.0_232-b18)
      OpenJDK 64-Bit Server VM (Zulu 8.42.0.14-SA-macosx) (build 25.232-b18, mixed mode)`
      expect(shouldUpgrade(result, 107)).toBeTruthy();
    })

    it('should default to upgrade needed if parse error occours', async () => {
      let result = `OpenJDK version "lskdksdsd.0_232"
      OpenJDK Runtime Environment (Zulu sdmskdsd.4sdkjskjdks.14-SA-macosx)
      OpenJDK 64-Bit Server VM (Zulusdkjksjdklsjdosx) (builsdll, mixed mode)`
      expect(shouldUpgrade(result, 0)).toBeTruthy();
      expect(shouldUpgrade(undefined, 0)).toBeTruthy();
    })
  })

  describe('updateJavaHome', () => {

    afterEach(afterEachCleanup)
    it('update path variable', async () => {
      const echoSpy = jest.spyOn(shell, 'echo');
      echoSpy.mockImplementation(()=>{});
      const file = 'file'
      updateJavaHome(file);
      expect(echoSpy).toBeCalledWith(`export "PATH=$PATH:${FOLDERS.install}/${file}/bin" >> ~/.bash_profile`);
    })
  })
});
