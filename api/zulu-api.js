const axios = require('axios');
const { constants: { zuluHost } } = require('../constants');

const fetchJdkBundle = async ({ jdkVersion, javaVersion, zuluVersion, os, ext, arch='x86'}) => {
  try {
    const result = await axios.get(`${zuluHost}bundles/?java_version=${javaVersion}&jdk_version=${jdkVersion}&zulu_version=${zuluVersion}&os=${os}&arch=${arch}&ext=${ext}`);
    return result;
  } catch(e) {
    throw e;
  }
}

module.exports = {
  fetchJdkBundle
}