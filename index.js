const debug = require('debug')('soap-converter:index')
const apiWSDL = require('apiconnect-wsdl')
const fs = require('fs')
const yaml = require('js-yaml')
const converter = require('./converters')

async function convert(options) {
    debug('convert', options)

    const wsdls = await apiWSDL.getJsonForWSDL(options.input)
    const serviceData = apiWSDL.getWSDLServices(wsdls)

    const opts = {
        inlineAttributes: options.inlineAttributes,
        suppressExamples: !options.examples,
        // type: 'wsdl-to-rest',
        wssecurity: options.useSecurity,
    }

    const services = []
    for (const item in serviceData.services) { // eslint-disable-line
        const { service: svcName, filename: wsdlId } =
            serviceData.services[item]

        const openapi = apiWSDL.createOpenApi(
            options.input,
            svcName,
            wsdlId,
            opts,
        )

        services.push(openapi)
    }

    const openApis = await Promise.all(services).then((apis) =>
        apis.map(({ openapi }) => openapi),
    )

    let isJSONOutput = true
    let out
    switch (options.target) {
        case 'Postman':
            out = converter.Postman(openApis)
            break
        case 'SwaggerJSON':
            ;[out] = openApis
            break
        case 'SwaggerYAML':
            out = yaml.dump(openApis[0])
            isJSONOutput = false
            break
        default:
            throw new Error(
                `output format [${options.target}] currently not supported`,
            )
    }

    const data = isJSONOutput ? JSON.stringify(out, null, 2) : out
    fs.writeFileSync(options.output, data)
}

module.exports = convert
