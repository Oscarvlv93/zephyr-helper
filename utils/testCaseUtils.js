function getTestResults(obj) {

    var elements = obj[0].elements;
    var testData = [];
    let untagged = [];
    let response = {};

    for (const k in elements) {
        testData[k] = {};

        elements[k].tags.forEach(data => {
            if (data.name.includes('@TestCaseKey')) {
                testKey = (data.name).split("=")[1];
                testData[k]['key'] = Object.assign(testKey);
            }
        });

        let duration = 0;



        if (testData[k]['key'] != undefined) {
            elements[k].steps.forEach(data => {
                duration += data.result.duration
                testData[k]['duration'] = Object.assign(duration / 1000000)
            })

            if (elements[k].steps[elements[k].steps.length - 1].result.status == 'passed') {
                testData[k]['status'] = Object.assign('Pass')
                testData[k]['name'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].name)
            } else {
                testData[k]['status'] = Object.assign('Fail')
                testData[k]['comment'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].result.error_message)
                testData[k]['name'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].name)
            }
        } else {
            untagged[k] = {};
            untagged[k]['id'] = Object.assign(elements[k].id);
            untagged[k]['name'] = Object.assign(elements[k].name);
            untagged[k]['script'] = ''
            elements[k].steps.forEach(data => {
                untagged[k]['script'] += data.keyword + data.name + "\n"
            })
        }
    }


    response = {
        "testData": testData.filter(value => Object.keys(value).length !== 0),
        "untagged": untagged.filter(value => Object.keys(value).length !== 0),
    }

    return response

}

module.exports = { getTestResults }