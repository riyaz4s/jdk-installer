const path = require('path')

const OS = {
  OSX: 'OSX',
  WIN: 'WIN',
  LINUX: 'LINUX'
};

const FOLDERS = {
  download: `../temp`,
  install: `../jdk`,
}

const constants = {
  zuluHost: `https://api.azul.com/zulu/download/community/v1.0/`,
  FOLDERS: {
    download: `${path.join(__dirname, FOLDERS.download)}`,
    install: `${path.join(__dirname, FOLDERS.install)}`,
    '7zip': `C:\\Program Files\\7-Zip\\7z.exe`
  },
  OS,
  OS_MAPPER: {
    [OS.LINUX]: 'linux',
    [OS.OSX]: 'macos',
    [OS.WIN]: 'windows'
  },
  FILE_EXT_MAPPER: {
    [OS.LINUX]: 'tar.gz',
    [OS.OSX]: 'tar.gz',
    [OS.WIN]: 'zip'
  }
}

const softwares = {
  ZULU_JDK: {
    jdkVersion: `11.0`,
    jdkVersionExpected: `8.0`,
    javaVersion: `11.0`,
    javaVersionExpected: `1.8`,
    zuluVersion: `11.33`,
  },
}

module.exports = {
  softwares,
  constants
}