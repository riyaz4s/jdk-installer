const shell = require('shelljs');
const { install } = require('./service/installer-service');
const { shouldUpgrade } = require('./utils/helper');

const main = async () => {
  const result = await shell.exec('java -version');
  try {
    const jdkDetails = result.stderr || '';
    if(shouldUpgrade(jdkDetails, result.code)) {
      await install();
    } else {
      shell.echo('All good')
    }
  } catch(e) {
    shell.echo('Installation failed', e)
    throw e;
  }

}
if(process.env.NODE_ENV !== 'test') {
  main();
}

module.exports = main; 