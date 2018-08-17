const insomnia = require('insomnia-importers')

module.exports = async function convert(items) {
    const raw = await insomnia.convert(items)

    return raw
}
