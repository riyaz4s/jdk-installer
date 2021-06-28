const shell = require('shelljs');
const { constants: { OS, FOLDERS }, softwares: { ZULU_JDK }} = require('../constants')

const getOsType = async () => {
  const result = await shell.exec('$(uname)');
  const osOut = result.stderr.toLowerCase();
  if(osOut.includes('darwin')) {
    return OS.OSX;
  } else if(osOut.includes('linux-gnu')) {
    return OS.LINUX;
  } else if(osOut.includes('cygwin')) {
    return OS.WIN;
  } else {
    shell.echo('Unsupported OS');
    throw Error('Unsupportd version');
  }
}


const downloadFile = async (url, path = FOLDERS.download) => {
  try {
    await shell.mkdir(path);
    await shell.cd(path);
    await shell.exec(`wget ${url}`);
    shell.echo('Download complete', url, path);
  } catch(e) {
    shell.echo('Download failed', url, path);
    throw e

  }
}

const installFile = async (os, file) => {
  try {
    const installerPath = FOLDERS.install
    await shell.mkdir(installerPath)
    await shell.cd(installerPath)
    if([OS.OSX, OS.LINUX].includes(os)) {
      await shell.exec(`tar -xzvf ${FOLDERS.download}/${file}`)
    } else {
      await shell.exec(`${FOLDERS['7zip']} e ${FOLDERS.download}/${file}`)
    }
    shell.echo('Extraction done');
  } catch(e) {
    shell.echo('Installation failed', os);
    throw e

  }
}

const updateJavaHome = (file) => {
  shell.echo(`export "PATH=$PATH:${FOLDERS.install}/${file}/bin" >> ~/.bash_profile`);
}

const cleanTemp = () => {
  shell.rm('-rf', FOLDERS.download)
}


const shouldUpgrade = (result = '', code) => {
  try {
    if(code !== 0) {
      return true
    }
    if(!(result && result.toLowerCase().includes('zulu'))) {
      return true;
    }
    const versionRegex = new RegExp(/([\s|\"])(\d+\.?\d+)/g);
    const javaVersionArr = versionRegex.exec(result) || [];
    const jdkVersionArr = versionRegex.exec(result) || [];
    const upgraded = javaVersionArr.length && parseFloat(javaVersionArr[2]) >= ZULU_JDK.javaVersionExpected && jdkVersionArr.length && parseFloat(jdkVersionArr[2]) >= ZULU_JDK.jdkVersionExpected
    return !upgraded;
  } catch(e) {
    shell.echo(e);
    return true;
  }

}

module.exports = {
  getOsType,
  downloadFile,
  installFile,
  shouldUpgrade,
  updateJavaHome,
  cleanTemp
}