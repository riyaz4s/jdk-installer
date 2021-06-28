const { fetchJdkBundle } = require('../api/zulu-api')
const { softwares: { ZULU_JDK, }, constants: { OS_MAPPER, FILE_EXT_MAPPER } } = require('../constants/index')
const { getOsType, downloadFile, installFile, updateJavaHome, cleanTemp } = require('../utils/helper')
const shell = require('shelljs');

const install = async () => {
  const userOs = await getOsType();
  const os = OS_MAPPER[userOs]
  const ext = FILE_EXT_MAPPER[userOs]
  const jdkOptions = {
    jdkVersion: ZULU_JDK.jdkVersion,
    javaVersion: ZULU_JDK.javaVersion,
    zuluVersion: ZULU_JDK.zuluVersion,
    os,
    ext,
  }
  const jdkDetailsList = await fetchJdkBundle(jdkOptions);
  if(jdkDetailsList && jdkDetailsList.data.length) {
    const jdkDetails = jdkDetailsList.data[0];
    shell.echo(`Downloading ${jdkDetails.name}`)
    await downloadFile(jdkDetails.url);
    await installFile(userOs, jdkDetails.name);
    updateJavaHome(jdkDetails.name.split(`.${ext}`)[0]);
    cleanTemp();
    shell.echo(`Installation completed ${JSON.stringify(jdkOptions)}`)
  } else {
    shell.echo(`Required jdk not found. Required ${JSON.stringify(jdkOptions)}`)
    throw Error(`Required jdk not found. Required ${JSON.stringify(jdkOptions)}`)
  }
}

module.exports = {
  install
}