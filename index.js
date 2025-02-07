const Connnector = require('apiconnect-wsdl')
const fs = require('fs')
const Converter = require('./converters')

async function convert(options) {
    const wsdls = await Connnector.getJsonForWSDL(options.input)
    const serviceData = Connnector.getWSDLServices(wsdls)

    const opts = {
        openapiVersion: options.openapiVersion,
        inlineAttributes: options.inlineAttributes,
        suppressExamples: !options.examples,
        // type: 'wsdl-to-rest',
        wssecurity: options.useSecurity,
    }

    const services = []
    for (const item in serviceData.services) { // eslint-disable-line
        const { service: svcName, filename: wsdlId } =
            serviceData.services[item]

        const openapi = Connnector.createOpenApi(
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

    let out
    switch (options.target) {
        case 'Postman':
            out = await Converter.Postman(openApis[0])
            break
        case 'OpenAPI':
        case 'Swagger':
            ;[out] = openApis
            break
        default:
            throw new Error(
                `Output format [${options.target}] currently not supported`,
            )
    }

    fs.writeFileSync(options.output, JSON.stringify(out, null, 2))
}

module.exports = convert
