const Converter = require('openapi-to-postmanv2')

function convert(openapi) {
    return new Promise((resolve, reject) => {
        Converter.convert(
            { type: 'json', data: openapi },
            {},
            (err, conversionResult) => {
                if (!conversionResult.result) {
                    reject(conversionResult.reason)
                } else {
                    resolve(conversionResult.output[0].data)
                }
            },
        )
    })
}

module.exports = convert
