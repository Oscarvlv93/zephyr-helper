# zephyr-cypress

Herramienta para la integración entre cypress + cucumber y zephyr.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install foobar.

```bash
npm install zephyr-cypress
```

## Usage

```javascript
let zpc = require('./node_modules/zephyr-cypress/index')


let req = {
    projectDataKey: '',
    api_key : "",
    testCycleKey : '',
    userId: ""
}

//Subir Resultados
zpc.uploadResult().then(s=>{console.log(s)})

//Or

zpc.uploadResult(req).then(s=>{console.log(s)})
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)