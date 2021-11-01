var fs = require('fs');
const path = require('path');

let parent = __dirname.split('node_modules')[0].replace(/\\/g, '/');
let resultDir = 'cypress/test-results/cucumber-json/'
let whatev = 'cypress/integration/dashboard/dashboard-cl.feature'

function getFiles() {

    let paths = fs.readdirSync(parent + resultDir)
    let files = [];
    for (const key in paths) {
        files[key] = JSON.parse(fs.readFileSync(parent + resultDir + paths[key]))
    }

    return files

}

function getConfig() {
    let filePath = fs.readdirSync(parent).filter(s => s.match('cypress.json'))
    return JSON.parse(fs.readFileSync(parent + filePath))
}



async function folderSplit (val) {

  let results = await val.map(forichSplit)
  return results
}


function forichSplit(val)
{
  let firstSplit = val.folder.split(' ')
  let subfolder = firstSplit[firstSplit.length - 1];
  let folder = val.folder.split(subfolder)[0]
  return folder
}

module.exports = { getFiles, getConfig, folderSplit }



//Quizas crear los casos no tageados no sea tan dificil
