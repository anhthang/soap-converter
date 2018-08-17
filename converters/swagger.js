const yaml = require('js-yaml')

module.exports = function convert(data) {
    return yaml.safeDump(data)
}
