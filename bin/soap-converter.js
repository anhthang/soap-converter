#!/usr/bin/env node

const inquirer = require('inquirer').default
const { program } = require('commander')
const untildify = require('untildify').default
const soap2rest = require('..')

function isAllowedValue(regExpStr) {
    const pattern = new RegExp(regExpStr)

    return (value) => {
        if (typeof value !== 'string') {
            throw new TypeError(`Expected a string, received ${typeof value}`)
        }

        if (!pattern.test(value)) {
            throw new Error(
                `Invalid option value: "${value}". Must match: ${regExpStr}`,
            )
        }

        return value
    }
}

program
    .option('-i, --input <url>', 'URL or path to the WSDL file (required)')
    .option(
        '-t, --target <type>',
        'Output format: `Postman Collection v2.1`, `OpenAPI 2.0 (formerly Swagger)`, or `OpenAPI 3`',
        isAllowedValue('^(Postman|OpenAPI|Swagger)$'),
    )
    .option(
        '-v, --openapi-version <version>',
        'OpenAPI version (`3.0`, or `3.1`) — required if target is `OpenAPI 3`',
    )
    .option(
        '-o, --output <file>',
        'Output path including filename (e.g. `./converted/weather.openapi.json`)',
    )
    .option(
        '-k, --api-key-header <name>',
        'Add a custom API key header name (e.g. `X-API-Key`)',
    )
    .option('--use-security', 'Enable WS-Security in generated requests', false)
    .option(
        '--use-ibm-datapower-gateway',
        'Add IBM DataPower Gateway-specific headers to requests',
        false,
    )
    .option(
        '--no-examples',
        'Skip generating example request/response payloads',
    )
    .option(
        '--no-inline-attributes',
        'Avoid embedding XML attributes inline; separates them for better clarity',
    )
    .action(async (options) => {
        const first = []

        if (!options.input) {
            first.push({
                name: 'input',
                message: 'Enter the URL or path to the WSDL file:',
            })
        }

        if (!options.target) {
            first.push({
                name: 'target',
                message: 'Choose an output format:',
                type: 'list',
                choices: [
                    {
                        name: 'Postman Collection v2.1',
                        value: 'Postman',
                    },
                    {
                        name: 'OpenAPI 2.0 (formerly Swagger 2.0)',
                        value: 'Swagger',
                    },
                    {
                        name: 'OpenAPI 3',
                        value: 'OpenAPI',
                    },
                ],
            })
        }

        const answers = await inquirer.prompt(first)
        Object.assign(options, answers)

        const second = []
        if (options.target === 'OpenAPI' && !options.openapiVersion) {
            second.push({
                name: 'openapiVersion',
                message: 'Choose OpenAPI version:',
                type: 'list',
                choices: [
                    { name: 'OpenAPI 3.0', value: '3.0' },
                    { name: 'OpenAPI 3.1', value: '3.1' },
                ],
            })
        }

        if (!options.output) {
            second.push({
                name: 'output',
                message: 'Enter output file path:',
                filter: (input) => untildify(input),
            })
        }

        const secondAnswers = await inquirer.prompt(second)
        Object.assign(options, secondAnswers)

        soap2rest(options)
    })
    .parse(process.argv)
