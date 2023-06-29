import * as send from './request-handler'
import * as fs from 'fs';

const root = __dirname.split('node_modules')[0].replace(/\\/g, '/')



async function uploadResults(path: string, projectKey: string, apiKey: string, versionData: any, ext?: string) {

    const files = fs.readdirSync(root + path).filter(file => { return file.includes(`${ext || '.txt'}`) })

    try {

        const folderData = await findTestCycleFolder(apiKey, versionData)

        const testCycles = await
            (await
                send.getRequest('testcycles', apiKey, ["projectKey=WDP", `folderId=${folderData.folderId}`, "maxResults=1000"]))
                .message.values

        const uploadResults: any = []

        for await (const file of files) {
            const tests = fs.readFileSync(`${root + path}/${file}`).toString().split('\n')

            const bodies: any = [];

            for await (const test of tests) {
                const status = test.match(/:(\w+):/);

                if (!status) continue

                let statusName: any

                switch (status && status[1]) {
                    case 'white_check_mark':
                        statusName = 'Pass'
                        break;
                    case 'no_entry':
                        statusName = 'Fail'
                        break;
                    case 'manual':
                        statusName = 'Not Executed'
                        break;
                }


                const testKey = test.match(/@(WDP-T\d*)/);
                const added = test.match(/\[added:(.*?)\]/i);

                let flowName: any = test.match(/\[(.*?) - @WDP-(.*?)\]/)
                let testCycleKey

                for await (const cycle of testCycles) {
                    let cycleName = cycle.name.split('-')[2].trim()
                    if (cycleName.toUpperCase() == (flowName && flowName[1].toUpperCase())) {
                        testCycleKey = cycle.key
                        break
                    }
                }

                bodies.push({
                    projectKey: projectKey,
                    testCycleKey: `${testCycleKey}` || null,
                    statusName: statusName || null,
                    testCaseKey: (testKey && testKey[1]) || null,
                    addedTests: (added && added[1].split('-'))?.map(test => { return 'WDP-' + test }) || null,
                    environmentName: 'QA',
                    actualEndDate: new Date().toISOString(),
                    executedById: '60bfa1299469280070d54057',
                    assignedToId: '60bfa1299469280070d54057'
                })
            }

            for await (const body of bodies) {

                const added = body.addedTests

                delete body.addedTests

                if (!body.testCaseKey || !body.testCycleKey) {
                    continue
                }


                uploadResults.push({
                    file: file,
                    body: body,
                    result: await send.postRequest(body, 'testexecutions', apiKey)
                })

                if (added) {
                    for await (const test of added) {
                        let addedBody = { ...body }
                        addedBody.testCaseKey = test
                        uploadResults.push({
                            file: file,
                            body: addedBody,
                            result: await send.postRequest(addedBody, 'testexecutions', apiKey)
                        })
                    }
                }


            }
        }

        return {
            status: true,
            uploadResults
        }

    } catch (error) {

        return { status: false, message: "uploadResults error: " + error }
    }
}

async function findTestCycleFolder(apiKey: string, versionData: any) {

    try {
        let folderData: any = {}

        const SO: string = (versionData.so.toUpperCase() === 'AOS' ? 'ANDROID' : 'IOS')

        const folderName = `${versionData.country.toUpperCase()} - ${SO} - ${versionData.appVersion} (${versionData.codeVersion})`

        await (await send.getRequest('folders', apiKey, ["projectKey=WDP", "folderType=TEST_CYCLE", "maxResults=1000"]))
            .message.values.filter((folder: any) => {

                folder.name.toUpperCase() === folderName ?
                    (folderData.folderId = folder.id, folderData.folderName = folder.name) : ''
            })

        return folderData

    } catch (error) {


        return { status: false, message: "findTestCycleFolder error: " + error }

    }
}

async function createCycleFolder(apiKey: string, versionData: any) {

    try {

        const SO: string = (versionData.so.toUpperCase() === 'AOS' ? 'Android' : 'iOS')

        const folderName: string = `${versionData.country.toUpperCase()} - ${SO} - ${versionData.appVersion} (${versionData.codeVersion})`

        const folders: any = await
            (await send.getRequest('folders', apiKey, ["projectKey=WDP", "folderType=TEST_CYCLE", "maxResults=1000"])).message.values

        const baseFolder = folders.find((folder: any) => { return folder.name.toUpperCase() === `${versionData.country.toUpperCase()} - ${SO.toUpperCase()} - BASE` })

        const created = folders.find((folder: any) => { return folder.name.toUpperCase() === folderName.toUpperCase() })

        if (created) return { status: 400, message: { error: "Already Exist", folder: created } }

        const body = {
            "parentId": baseFolder.parentId,
            "name": folderName,
            "projectKey": "WDP",
            "folderType": baseFolder.folderType
        }

        let create: object = await send.postRequest(body, 'folders', apiKey)

        return { status: 201, message: "Created", folder: create }

    } catch (error) {


        return { status: false, message: "createCycleFolder error: " + error }

    }
}

async function addTestCycles(apiKey: string, versionData: any) {
    try {

        const SO: string = (versionData.so.toUpperCase() === 'AOS' ? 'Android' : 'iOS')

        const folderName: string = `${versionData.country.toUpperCase()} - ${SO} - ${versionData.appVersion} (${versionData.codeVersion})`

        const folders: any = await
            (await send.getRequest('folders', apiKey, ["projectKey=WDP", "folderType=TEST_CYCLE", "maxResults=1000"])).message.values

        const baseFolder = folders.find((folder: any) => { return folder.name.toUpperCase() === `${versionData.country.toUpperCase()} - ${SO.toUpperCase()} - BASE` })

        const targetFolder = folders.find((folder: any) => { return folder.name.toUpperCase() === folderName.toUpperCase() })

        const testCycles = await
            (await
                send.getRequest('testcycles', apiKey, ["projectKey=WDP", `folderId=${baseFolder.id}`, "maxResults=1000"]))
                .message.values

        const targetFolderCheck = await
            (await
                send.getRequest('testcycles', apiKey, ["projectKey=WDP", `folderId=${targetFolder.id}`, "maxResults=1000"]))
                .message.values

        if (targetFolderCheck.length) return { status: false, message: "The folder has cycles" }

        for await (const cycle of testCycles) {

            let body = {
                "projectKey": 'WDP',
                "name": `${versionData.country.toUpperCase()} - ${SO} ${versionData.appVersion} (${versionData.codeVersion}) - ${cycle.name}`,
                "folderId": targetFolder.id
            }

            await send.postRequest(body, 'testcycles', apiKey)
        }


        return { status: 200, message: "Cycles added" }

    } catch (error) {

        return { status: false, message: "addTestCycles error: " + error }

    }

}



export { uploadResults, createCycleFolder, addTestCycles }