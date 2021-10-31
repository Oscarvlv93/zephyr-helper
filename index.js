var methods = require('./utils/requestUtils')
var testresults = require('./utils/testCaseUtils')
var fileUtils = require('./utils/filesUtils')


let zephyr = fileUtils.getConfig();

let api_key = zephyr.zephyr == undefined ? '' : zephyr.zephyr.api_key
let projectKey = zephyr.zephyr == undefined ? '' : zephyr.zephyr.projectData.key
let testCycleKey = zephyr.zephyr == undefined ? '' : zephyr.zephyr.testCycleData.key

let files = fileUtils.getFiles();

let tests = [];
let untagged = [];

for (const key in files) {
    tests[key] = testresults.getTestResults(files[key]).testData;
    untagged[key] = []
    untagged[key] = testresults.getTestResults(files[key]).untagged
    untagged[key]['folder'] = files[key][0].name
}

untagged.forEach(s => {
    let a = s.folder.split(' ')
    let subfolder = a[a.length - 1];
    let folder = s.folder.split(subfolder)[0]

})


async function uploadResult(req) {

    let args = {}
    if (!req) {
        args['projectDataKey'] = Object.assign(projectKey)
        args['api_key'] = Object.assign(api_key)
        args['testCycleKey'] = Object.assign(testCycleKey)
        
    } else {
       

        args['projectDataKey'] = Object.assign(req.projectDataKey)
        args['api_key'] = Object.assign(req.api_key)
        args['testCycleKey'] = Object.assign(req.testCycleKey)
    }

    let executions = []
    tests.forEach(feature => {
        feature.map(function (testcase, index, array) {
            testcase['testCycleKey'] = args.testCycleKey;
            return executions.push(methods.createTestExecution(args.projectDataKey, args.api_key, testcase).then(res => {
                return res;
            }))
        })
    })
    return executions = Promise.all(executions).then((values) => {
        return values
    });
}



async function getStatuses(statusType) {
    return methods.getStatuses(statusType || 'TEST_CASE', zephyr.projectData.key, api_key)
}


async function createTestCycle(req) {
    return methods.createTestCycle(req, zephyr.projectData.key, api_key)
}

async function returnUntagged() {
    return untagged
}

async function returnTests() {
    return tests
}


async function getFolders(projectKey) {
    return methods.getFolders(projectKey || zephyr.projectData.key, api_key)
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