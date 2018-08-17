const debug = require('debug')('soap-converter:index')
const apiWSDL = require('apiconnect-wsdl')
const fs = require('fs')
const converter = require('./converters')

async function convert({ input, output, target }) {
    debug('convert', input)

    const wsdls = await apiWSDL.getJsonForWSDL(input)
    const serviceData = apiWSDL.getWSDLServices(wsdls)

    const items = []
    // Loop through all services
    for (const item in serviceData.services) { // eslint-disable-line
        const svcName = serviceData.services[item].service
        const wsdlId = serviceData.services[item].filename
        const wsdlEntry = apiWSDL.findWSDLForServiceName(wsdls, svcName)
        const swagger = apiWSDL.getSwaggerForService(wsdlEntry, svcName, wsdlId)

        items.push(swagger)
    }

    let isJSONOutput = true
    let out
    switch (target) {
        case 'Postman':
            out = converter.Postman(items)
            break
        case 'SwaggerJSON':
            ;[out] = items
            break
        case 'SwaggerYAML':
            out = converter.Swagger(items[0])
            isJSONOutput = false
            break
        default:
            throw new Error(`output format [${target}] currently not supported`)
    }

    const data = isJSONOutput ? JSON.stringify(out, null, 2) : out
    fs.writeFileSync(output, data)
}

module.exports = convert
