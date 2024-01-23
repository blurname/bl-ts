import { getPackageJsonFile } from '@blurname/core/src/node/meta-file/npm'
import { createFzfKit } from '../util/fzf.js'
import { execSync, spawnSync } from 'node:child_process'
const metaScriptFzfDesc = 'use fzf to search & execute script in project meta file '
const metaScriptFzf = async () => {
  const jsonFileKit = getPackageJsonFile()
  const packageJson = JSON.parse(jsonFileKit.getFileContent()) as {scripts:Record<string, string>}

  const scriptKeyList:string[] = []

  const keyDescMap = new Map(Object.entries(packageJson.scripts))

  Object.entries(packageJson.scripts).forEach(([k]) => {
    scriptKeyList.push(k)
  })

  const config = {
    msg: (item:string) => {
      return `${item}: ${keyDescMap.get(item)}\n`
    }
  }
  const runCallback = (selectKey:string) => {
    spawnSync('npm', ['run', selectKey], { stdio: 'inherit' })

    try { // tmux
      const tmuxQueryRes = execSync('env | grep -i tmux').toString()
      if (tmuxQueryRes.includes('TERM_PROGRAM=tmux')) {
        spawnSync('tmux', ['send-keys', `npm run ${selectKey}`], { stdio: 'inherit' })
      }
    } catch (e) {
      //
    }

    try { // zellij
      const zellijQueryRes = execSync('env | grep -i ZELLIJ').toString()
      if (zellijQueryRes.includes('ZELLIJ')) {
        spawnSync('zellij', ['action', 'write-chars', `npm run ${selectKey}`], { stdio: 'inherit' })
      }
    } catch (e) {
      //
    }
  }

  const fzfKit = createFzfKit({ fzfStringList: scriptKeyList, config })
  fzfKit.runFzf({ runCallback })
}
export {
  metaScriptFzf, metaScriptFzfDesc
}

// https://www.educative.io/answers/what-is-readlineemitkeypressevents-in-nodejs
// const readline = require('readline');

// console.log("Press any key")
