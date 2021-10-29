var methods = require('zephyr-cypress/utils/requestUtils')
var testresults = require('zephyr-cypress/utils/testCaseUtils')
var fileUtils = require('./utils/filesUtils')
var fs = require('fs');

let zephyr = fileUtils.getConfig().zephyr;
let files = fileUtils.getFiles();
let tests = [];
for (const key in files) {
    tests[key] = {};
    tests[key] = testresults.getTestResults(files[key], zephyr.projectData.key);
}

async function uploadResult() {
    let executions = []
    tests.forEach(feature => {
        feature.map(function (testcase, index, array) {
            testcase['testCycleKey'] = zephyr.testCycleData.key;
            return executions.push(methods.createTestExecution(zephyr.projectData.key, zephyr.api_key, testcase).then(res => {
                return JSON.parse(res);
            }))
        })
    })
    return executions = Promise.all(executions).then((values) => {
        return values
    });
}



async function getStatuses(statusType){
       return  methods.getStatuses(statusType || 'TEST_CASE', zephyr.projectData.key, zephyr.api_key)
}


async function createTestCycle(req){
    return methods.createTestCycle(req, zephyr.projectData.key, zephyr.api_key)
}



module.exports = { uploadResult, getStatuses,  createTestCycle}