An Enterprise JDK installer

Relaies on `java -version` command to get the current JDK version

Upgrades JDK if necessary. Upgrade threashold are maintained in `constants/index.js`

JDK installation path is set as `<root>/jdk`

Provides support for osx, linux and windows

Steps to run
```
git clone https://github.com/riyaz4s/jdk-installer.git
npm install
npm run start
```
Steps to run test
```
npm run unit
```