#!/usr/bin/env node

const inquirer = require('inquirer').default
const { program } = require('commander')
const untildify = require('untildify').default
const soap2rest = require('..')

function isAllowedValue(regExpStr) {
    // return a function which checks the value is in the allowedValues
    return (value) => {
        if (!RegExp(regExpStr).test(value)) {
            throw Error(`Invalid option value: ${value}`)
        }

        return value
    }
}

program
    .option(
        '-i, --input <url>',
        'The URL of the WSDL file (e.g., `http://example.com/service.svc?wsdl`)',
    )
    .option(
        '-t, --target <type>',
        'The target format: `Postman Collection`, `OpenAPI 2 / Swagger`, `OpenAPI 3`.',
        isAllowedValue('^(Postman|OpenAPI|Swagger)$'),
    )
    .option(
        '-v, --openapi-version <version>',
        'Specify the OpenAPI version to use for the output (e.g., `3.0`, `3.1`). If this option is not provided, OpenAPI 2.0 (formerly Swagger 2.0) is used',
    )
    .option(
        '-o, --output <file>',
        'The path to the output file (e.g., `service.postman.json`)',
    )
    .option(
        '-k, --api-key-header <name>',
        "specify an apiKey header name (e.g. 'X-API-Key')",
    )
    .option('--use-security', 'Enable WS-Security', false)
    .option(
        '--use-ibm-datapower-gateway',
        'Enable IBM DataPower Gateway headers',
        false,
    )
    .option('--no-examples', 'Disable generating examples in the output')
    .option('--no-inline-attributes', 'Disable inline attributes in the output')
    .action(async (options) => {
        const first = []

        if (!options.input) {
            first.push({
                name: 'input',
                message:
                    'Enter the URL or path to the WSDL file (example: http://example.com/service.svc?wsdl):',
            })
        }

        if (!options.target) {
            first.push({
                name: 'target',
                message: 'Select the target format:',
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
                message: 'Specify the OpenAPI version (3.0, 3.1):',
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
                message: 'Enter the path for the output file:',
                filter: (input) => untildify(input),
            })
        }

        const secondAnswers = await inquirer.prompt(second)
        Object.assign(options, secondAnswers)

        soap2rest(options)
    })
    .parse(process.argv)
