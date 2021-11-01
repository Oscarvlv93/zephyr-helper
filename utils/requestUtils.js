const BASE_URL = 'https://api.zephyrscale.smartbear.com/v2/';

const { doRequest } = require("./request-handler");

async function getTestCases(key, jwt) {

    var data = {
        url: BASE_URL + `testcases?projectKey=${key}&maxResults=${100}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data)
}

async function getTestCase(key, jwt) {

    var data = {
        url: BASE_URL + `testcases/${key}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data)
}

async function getFolders(folderType, key, jwt) {

    var data = {
        url: BASE_URL + `folders?projectKey=${key}&maxResults=${100}&folderType=${folderType}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data)
}

async function getProject(key, jwt) {

    var data = {
        url: BASE_URL + `projects/${key}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function getProjects(jwt) {

    var data = {
        url: BASE_URL + 'projects?maxResults=100',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function getTestCycles(key, jwt) {

    var data = {
        url: BASE_URL + 'testcycles?projectKey=WDP',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function getTestCycle(id, jwt) {

    var data = {
        url: BASE_URL + `testcycles/${id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function getStatuses(statusType, key, jwt) {

    var data = {
        url: BASE_URL + `statuses?statusType=${statusType}&projectKey=${key}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function getEnvironments(key, jwt) {

    var data = {
        url: BASE_URL + `environments?projectKey=${key}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };

    return await doRequest(data);

}

async function createTestCycle(req, key, jwt) {

    var data = {
        url: BASE_URL + `testcycles`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
            "projectKey": key,
            "name": req.name || "Ciclo de prueba Zephyr Cypress",
            "description": req.description || "Descripcion de ciclo de prueba Zephyr Cypress",
            "plannedStartDate": req.plannedStartDate || new Date(),
            "plannedEndDate": req.plannedEndDate || new Date(),
            "jiraProjectVersion": req.jiraProjectVersion || 1,
            "statusName": req.statusName || "Done",
            "ownerId": req.ownerId,
            "customFields": {
            }
        })
    };

    return await doRequest(data);

}

async function uploadResult(key, jwt) {

    var data = {
        url: BASE_URL + `automations/executions/custom?projectKey=${key}`,
        method: 'POST',
        headers: {
            'Content-length': stats.size,
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jwt}`,
        },
        formData: {
            file: filetosend
        }
    };

    return await doRequest(data);

}

async function createTestExecution(testdata, key, jwt) {

    var data = {
        url: BASE_URL + `testexecutions`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            "projectKey": key,
            "testCaseKey": testdata.key,
            "testCycleKey": testdata.testCycleKey,
            "statusName": testdata.status,
            "testScriptResults": [
                {
                    "statusName": testdata.status,
                    "actualEndDate": new Date(),
                    "actualResult": testdata.status + ' ' + testdata.name
                }
            ],
            "environmentName": "INT",
            "actualEndDate": new Date(),
            "executionTime": testdata.duration,
            "executedById": testdata.userId,
            "assignedToId": testdata.userId,
            "comment": testdata.comment || testdata.status,
            "customFields": {
            }
        })
    };
 

    return await doRequest(data) ;

}


module.exports = {
    getFolders,
    getProject,
    getProjects,
    getTestCycles,
    getTestCycle,
    createTestCycle,
    //uploadResult, 
    createTestExecution,
    getStatuses,
    getEnvironments,
    getTestCases,
    getTestCase
}
