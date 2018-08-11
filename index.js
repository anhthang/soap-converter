const debug = require('debug')('wsdl2postman:index')
const apiWSDL = require('apiconnect-wsdl')
const fs = require('fs')
const { get } = require('lodash')

async function convert(path) {
    debug('convert')

    let items = []
    const wsdls = await apiWSDL.getJsonForWSDL(path)

    const serviceData = apiWSDL.getWSDLServices(wsdls)

    // Loop through all services
    for (const item in serviceData.services) { // eslint-disable-line
        const svcName = serviceData.services[item].service
        const wsdlId = serviceData.services[item].filename
        const wsdlEntry = apiWSDL.findWSDLForServiceName(wsdls, svcName)
        const swagger = apiWSDL.getSwaggerForService(wsdlEntry, svcName, wsdlId)

        items.push(swagger)
    }

    const out = {
        info: {
            name: get(items[0], 'info.title'),
            schema: 'https://schema.getpostman.com/json/collection/v2.0.0/' // required
        }
    }

    items = items.map(i => {
        const item = []
        const url = get(
            i,
            'x-ibm-configuration.assembly.execute.0.proxy.target-url'
        )
        for (const k in i.paths) { // eslint-disable-line
            const methods = i.paths[k]

            for (const method in methods) { // eslint-disable-line
                const api = methods[method]
                const paths = get(api, 'parameters.0.schema.$ref').split('/')
                paths.shift()
                paths.push('example')
                const example = get(i, paths.join('.'))

                item.push({
                    name: api.operationId,
                    description: api.description,
                    request: {
                        url,
                        method,
                        header: [
                            {
                                key: 'SOAPAction',
                                value: get(api, 'x-ibm-soap.soap-action'),
                                disabled: false
                            },
                            {
                                key: 'Content-Type',
                                value: get(i, 'consumes.0'),
                                disabled: false
                            },
                            {
                                key: 'Accept',
                                value: get(i, 'produces.0'),
                                disabled: false
                            }
                        ],
                        body: {
                            mode: 'raw',
                            raw: example
                        }
                    }
                })
            }
        }

        return {
            name: get(i, 'info.title'),
            item
        }
    })

    out.item = items

    return out
}

Promise.resolve(
    convert(
        'http://xmlusd.alphatoursdubai.com/webservice/OTA_HotelAvail.asmx?wsdl'
    )
)
    .then(out => {
        fs.writeFileSync('output-postman.json', JSON.stringify(out, null, 2))
    })
    .catch(error => {
        debug('convert error', error.stack)
    })

// module.exports = convert
