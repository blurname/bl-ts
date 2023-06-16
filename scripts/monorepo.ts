import { execSync } from 'node:child_process'
import { detectSubVersionNeedToUpdate } from './detect-sub-version.js'
import { versionBump } from './version-bump.js'
const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify']

const monoRepo = () => {
  const func = process.argv[2]
  if (func === 'clean-dist') {
    cleanDist()
  } else if (func === 'clean-node-modules') {
    cleanNodeModules()
  } else if (func === 'version-bump') {
    const needToBumpPkgList = detectSubVersionNeedToUpdate(SUB_PACKAGE_LIST)
    versionBump(needToBumpPkgList)('patch')
  }
}
const cleanDist = () => {
  const pkgStr = SUB_PACKAGE_LIST.join(',')
  execSync(`rm -rf dist packages/{${pkgStr}}/dist`)
}

const cleanNodeModules = () => {
  const pkgStr = SUB_PACKAGE_LIST.join(',')
  execSync(`rm -rf node_modules packages/{${pkgStr}}/node_modules`)
}

monoRepo()

export {
  SUB_PACKAGE_LIST
}
