import * as fs from 'fs';
import * as send from './request-handler'

const root = __dirname.split('node_modules')[0].replace(/\\/g, '/')

//hola

async function uploadResults(path: string, projectKey: string, apiKey: string, ext?: string) {


    const files = fs.readdirSync(root + path).filter(file => { return file.includes(`${ext || '.json'}`) })

    const cycleFolders = await (await send.getRequest('folders', apiKey, [`projectKey=${projectKey}`, "folderType=TEST_CYCLE", "maxResults=1000"])).message.values.filter((folder: any) => {
        return folder.name.includes('BFF') || folder.name.includes('API') 
    })


    try {
        const result = []

        for await (const file of files) {

            const readFile: any = JSON.parse(fs.readFileSync(`${root + path}/${file}`).toString())

            if (!readFile.results[0]) continue

            const tests: any = readFile.results[0].suites[0].tests

            const testCycle: any = await findTestCycle(projectKey, apiKey, readFile.results[0].suites[0].title, cycleFolders)

            if (!testCycle.cycleData.key) continue

            const bodies = []

            for await (const test of tests) {
                const regEx = new RegExp(`(${projectKey}-T\\d*)`) 
                const key: string = test.title.match(regEx) || null

                if (!key) continue

                const body = {
                    testCaseKey: (key && key[1]) || null,
                    statusName: (test.state == "passed" ? "Pass" : "Fail") || null,
                    projectKey,
                    testCycleKey: testCycle.cycleData.key || null,
                    environmentName: 'QA',
                    actualEndDate: new Date().toISOString(),
                    executionTime: test.duration * 10
                }

                bodies.push(body)
            }


            for await (const body of bodies) {
                if (!body.testCaseKey) {
                    continue
                }
                const zephyrResponse: any = await send.postRequest(body, 'testexecutions', apiKey)
                result.push({
                    featureName : readFile.results[0].suites[0].title,
                    file: file,
                    body: body,
                    zephyrResult: zephyrResponse
                })
            }
        }

        return {
            status: true,
            result
        }
    }

    catch (error) {


        return {
            status: false,
            message: "uploadResults error: " + error
        }

    }
}

async function findTestCycle(projectKey: string, apiKey: string, featureName: string, folders: any) {
    try {

        const countryRegex = /^(.*?)\s+(CHI|PER|COL)/i;
        const lineMatch = featureName.match(countryRegex);

        const country = lineMatch ? lineMatch[2] : 'Wrong format';
        const feature = lineMatch ? lineMatch[1].trim() : 'Wrong format';

        if(country == 'Wrong format' || feature == 'Wrong format') return { status: true, cycleData: {} }

        const folder = folders.filter((folder: any) => { return folder.name.toUpperCase().includes(country.toUpperCase()) })

        let cycleData: any = {}

        await (await
            send.getRequest('testcycles', apiKey, [`projectKey=${projectKey}`, `folderId=${folder[0].id}`, "maxResults=1000"]))
            .message.values.filter((cycle: any) => {
                cycle.name.toUpperCase().includes(feature.toUpperCase()) ?
                    (cycleData.key = cycle.key, cycleData.name = cycle.name) : ''
            })

        return {
            status: true,
            cycleData
        }

    } catch (error) {

        return { status: false, message: "findTestCycle error: " + error }
    }


}

export { uploadResults }
