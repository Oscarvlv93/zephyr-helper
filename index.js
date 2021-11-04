var methods = require('./utils/requestUtils')
var testresults = require('./utils/testCaseUtils')
var fileUtils = require('./utils/filesUtils')


let config = fileUtils.getConfig();

let api_key = config.zephyr == undefined ? '' : config.zephyr.api_key
let projectKey = config.zephyr == undefined ? '' : config.zephyr.projectData.key
let testCycleKey = config.zephyr == undefined ? '' : config.zephyr.testCycleData.key
let userId = config.zephyr == undefined ? '' : config.zephyr.userId

let files = fileUtils.getFiles();

let tests = [];
let untagged = [];

for (const key in files) {
    tests[key] = testresults.getTestResults(files[key]).testData;
    untagged[key] = []
    untagged[key]['folder'] = files[key][0].name
    untagged[key]['tests'] = testresults.getTestResults(files[key]).untagged
}


async function idk(untagged) { //aca dentro va el proceso completo de tagear el caso
    let zephyrfolders = await orderingData()

    untagged.forEach(feature => { //Por cada caso no taggeado

        let splited = feature.folder.split(' ');
        let childFolder = splited[splited.length - 1]
        let parent = splited.splice(0, splited.length - 1)

        zephyrfolders.forEach(el => { //Obtengo el ID de la carpeta a la que pertenece
            if (el.name.includes(`${parent} BFF`)) {
                feature.folderId = el.child.filter(function (value) {
                    return value.name.substr(0, 3).toUpperCase() == childFolder.substr(0, 3)
                })[0].id
            }
        })

        if (feature.folderId == undefined) { //Si la carpeta no existe
            console.log("no existe la carpeta")
        } else {
            
        }
    })
}

uploadResult()

// untagged.forEach(feature => {

//     orderingData().then(res => {
//         let splited = feature.folder.split(' ');
//         let child = splited[splited.length - 1]
//         let parent = splited.splice(0, splited.length - 1)
//         let filteredFolder = res.filter(function (value) { return value.name.includes(`${parent} BFF`) })
//         console.log(filteredFolder)
//     })


// })

async function orderingData() {
    const foldersUnordered = await methods.getFolders('TEST_CASE', projectKey, api_key).then(res => { return res })
    const orderingData = await fileUtils.arrangeFolders(foldersUnordered)
    return orderingData
}



async function uploadResult(req) {
    let args = {}

    if (!req) {
        args['projectDataKey'] = Object.assign(projectKey)
        args['api_key'] = Object.assign(api_key)
        args['testCycleKey'] = Object.assign(testCycleKey)
        args['userId'] = Object.assign(userId)
    } else {
        args['projectDataKey'] = Object.assign(req.projectDataKey)
        args['api_key'] = Object.assign(req.api_key)
        args['testCycleKey'] = Object.assign(req.testCycleKey)
        args['userId'] = Object.assign(req.userId)
    }

    let executions = []
    tests.forEach(feature => {
        feature.map(function (testcase, index, array) {
            testcase['testCycleKey'] = args.testCycleKey;
            testcase['userId'] = args.userId;
            return executions.push(methods.createTestExecution(testcase, args.projectDataKey, args.api_key).then(res => {
                return res;
            }))
        })
    })
    return executions = Promise.all(executions).then((values) => {
        return values
    });
}



async function getStatuses(statusType) {
    return methods.getStatuses(statusType || 'TEST_CASE', projectKey, api_key)
}


async function createTestCycle(req) {
    return methods.createTestCycle(req, projectKey, api_key)
}

async function returnUntagged() {
    return untagged
}

async function returnTests() {
    return tests
}


async function getFolders(folderType) {
    return methods.getFolders(folderType, projectKey, api_key)
}

/*getFolders().then(s=>{
    console.log(s)
})*/

module.exports = {
    uploadResult,
    getStatuses,
    createTestCycle,
    returnUntagged,
    returnTests,
    getFolders
}
