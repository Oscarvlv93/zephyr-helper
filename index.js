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
let folders = {
    parents: [],
    childrens: ['Chile', 'Perú', 'Colombia']
}

for (const key in files) {
    tests[key] = testresults.getTestResults(files[key]).testData;
    untagged[key] = []
    untagged[key] = testresults.getTestResults(files[key]).untagged
    untagged[key]['folder'] = files[key][0].name
}

untagged.forEach(s => {
    let a = s.folder.split(' ')
    let subfolder = a[a.length - 1]
    let folder = s.folder.split(subfolder)[0]
    folders.parents.push(folder)
})

// fileUtils.folderSplit(untagged).then(res => console.log({
//     result:res
//   }))



async function orderingData()
{
  const foldersUnordered = await methods.getFolders('TEST_CASE', projectKey, api_key).then(res => { return res })
  const orderingData = await fileUtils.arrangeFolders(foldersUnordered)
  console.log(orderingData)
  //// return ordenringData
}


orderingData()



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
