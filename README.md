# zephyr-helper

Herramienta para la integración con zephyr.

## Installation

```bash
npm install zephyr-helper
```

## Usage

path: string: ruta desde la altura de node_modules hasta donde estan los archivos, como string. Por ejm: 'cypress/reports/html/.jsons', 

projectKey: string : key del proyecto donde se encuentran los ciclos de prueba. Por ejm: Wallet es 'WDP, 

api_key: string: API KEY que se obtiene desde JIRA, 

versionData: Para Appium, json con el siguiente formato:
```json 
{
  "country": "CL",
  "so": "aos",
  "appVersion": "1.19.0",
  "codeVersion": "12667"
}
```
ext?: string: extension del archivo a buscar, para futuras implementaciones, opcional



```javascript
import { cypress } from 'zephyr-helper'
import { appium } from 'zephyr-helper'

const api_key = ''

cypress.uploadResults(path: string, projectKey: string, testCycleKey: string, api_key: string, ext?: string)
    .then( r => 
        {console.log(JSON.stringify(r))})

appium.uploadResults(path: string, projectKey: string, api_key: string, versionData: any, ext?: string))
    .then( r => 
        {console.log(JSON.stringify(r))})
```

## License
ISC