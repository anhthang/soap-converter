const insomnia = require('insomnia-importers')

exports.convert = async function convert(items) {
    const raw = await insomnia.convert(items)

    return raw
}
