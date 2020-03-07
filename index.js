const debug = require('debug')('soap-converter:index')
const apiWSDL = require('apiconnect-wsdl')
const fs = require('fs')
const converter = require('./converters')

async function convert(options) {
    debug('convert', options.input)

    const wsdls = await apiWSDL.getJsonForWSDL(options.input)
    const serviceData = apiWSDL.getWSDLServices(wsdls)

    const items = []
    // Loop through all services
    for (const item in serviceData.services) { // eslint-disable-line
        const svcName = serviceData.services[item].service
        const wsdlId = serviceData.services[item].filename
        const wsdlEntry = apiWSDL.findWSDLForServiceName(wsdls, svcName)

        const swaggerOptions = {
            inlineAttributes: options.inlineAttributes,
            suppressExamples: !options.examples,
            type: 'wsdl',
            wssecurity: options.useSecurity
        }

        const swagger = apiWSDL.getSwaggerForService(
            wsdlEntry,
            svcName,
            wsdlId,
            swaggerOptions
        )

        if (!options.useIbmDatapowerGateway) {
            delete swagger.info['x-ibm-name']
            delete swagger['x-ibm-configuration']
        }

        if (options.apiKeyHeader) {
            swagger.securityDefinitions.clientID.name = options.apiKeyHeader

            if (!options.useIbmDatapowerGateway) {
                // ApiKeyAuth is more swagger-standard than clientID
                swagger.securityDefinitions.ApiKeyAuth =
                    swagger.securityDefinitions.clientID
                delete swagger.securityDefinitions.clientID
                swagger.security = [{ ApiKeyAuth: [] }]
            }
        }

        items.push(swagger)
    }

    let isJSONOutput = true
    let out
    switch (options.target) {
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
            throw new Error(
                `output format [${options.target}] currently not supported`
            )
    }

    const data = isJSONOutput ? JSON.stringify(out, null, 2) : out
    fs.writeFileSync(options.output, data)
}

module.exports = convert
