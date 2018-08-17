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

    let isJSONOutput = false
    let out
    switch (target) {
        case 'Postman':
            out = converter.Postman(items)
            isJSONOutput = true
            break
        case 'Insomnia':
            out = await converter.Insomnia(items)
            break
        case 'SwaggerJSON':
            ;[out] = items
            isJSONOutput = true
            break
        case 'SwaggerYAML':
            out = converter.Swagger(items[0])
            break
        default:
            throw new Error(`output format [${target}] currently not supported`)
    }

    const data = isJSONOutput ? JSON.stringify(out, null, 2) : out
    fs.writeFileSync(output, data)
}

module.exports = convert
