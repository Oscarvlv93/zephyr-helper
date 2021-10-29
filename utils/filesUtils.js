var fs = require('fs');
const path = require('path');

let parent = __dirname.split('node_modules')[0].replace(/\\/g, '/');
let resultDir = 'cypress/test-results/cucumber-json/'

/*function resolvePath(path){
    let results = fs.readdirSync(parent).filter(s => s.match(path));
    let paths = [];
    for (let i = 0 ; i < results.length ; i++){
        paths[`${results[i]}`] = parent + results[i]
        try{
            paths[`${results[i]}`] = paths[`${results[i]}`] + "/" +  fs.readdirSync(paths[`${results[i]}`])

        } catch(error){
            console.log("no existe")
        }
    }
    console.log(paths)
}*/


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



module.exports = { getFiles, getConfig }



