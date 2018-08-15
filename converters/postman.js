const { get } = require('lodash')

function convert(items) {
    const out = {
        info: {
            name: get(items[0], 'info.title'),
            schema: 'https://schema.getpostman.com/json/collection/v2.0.0/' // required
        }
    }

    out.item = items.map(i => {
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

    return out
}

module.exports = convert
