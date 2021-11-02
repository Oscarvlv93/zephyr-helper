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

async function arrangeFolders (data) {
  if (data === undefined) {
    return 'From arrangeFolders: data undefined'
  }

  if(data.length = 0){
    return 'From arrangeFolders: data is empty'
  }
  
  let values = data.values
  let parent = []
  let child = []
  values.forEach(val => {
    if(val.parentId === null){
        parent.push(val)
      }else{
        child.push(val)
      }
  })
  let order = ordering(parent)
  return order
}


function ordering(parent,child)
{ 
  if(child === undefined){
    return {
      msg:"Form arrangeFolders: no children found",
      data: parent
    }
  }
  let objectOr = []
  parent.forEach(parentSelect => {
    objectOr.push(parentSelect)
    child.forEach(childSelect => {
      if(childSelect.parentId === parentSelect.id)
      {
        if(objectOr[objectOr.length-1].child === undefined){
          objectOr[objectOr.length-1].child = []
          objectOr[objectOr.length-1].child.push(childSelect)
        }else{
          objectOr[objectOr.length-1].child.push(childSelect)
        }
      }
    })
  return objectOr})
  return objectOr
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

module.exports = { getFiles, getConfig, folderSplit, arrangeFolders }



//Quizas crear los casos no tageados no sea tan dificil
