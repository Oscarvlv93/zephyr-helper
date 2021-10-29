function getTestResults(obj, key) {

    var elements = obj[0].elements;
    var testData = [];


    for (const k in elements) {
        testData[k] = {};    

        (elements[k].tags).forEach(data => {
            if ((data.name).includes('@TestCaseKey')) {
                testKey = (data.name).split("=").filter(s => (s).includes(key))[0];
                testData[k]['key'] = Object.assign(testKey);
            }
        });

        let duration = 0;
        

        switch(testData[k]['key'] != undefined){
            case true:
                (elements[k].steps).forEach(data => {
                    duration += data.result.duration
                    testData[k]['duration'] = Object.assign(duration / 1000000)
                    if (elements[k].steps[elements[k].steps.length - 1].result.status == 'passed') {
                        testData[k]['status'] = Object.assign('Pass')
                        testData[k]['name'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].name)
                    } else {
                        testData[k]['status'] = Object.assign('Fail')
                        testData[k]['comment'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].result.error_message)
                        testData[k]['name'] = Object.assign(elements[k].steps[elements[k].steps.length - 1].name)
                    }
                })
                break
            case false:
                console.log("Que hacer si el caso no tiene tag?")
                break
        }
    }


    return testData.filter(value => Object.keys(value).length !==0)

}

module.exports = { getTestResults }