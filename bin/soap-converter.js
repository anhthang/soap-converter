#!/usr/bin/env node

const inquirer = require('inquirer').default
const { program } = require('commander')
const untildify = require('untildify').default
const converter = require('..')

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
    .action((options) => {
        const prompts = []

        if (!options.input) {
            prompts.push({
                name: 'input',
                message:
                    'Enter the URL or path to the WSDL file (example: http://example.com/service.svc?wsdl):',
            })
        }

        if (!options.target) {
            prompts.push({
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

        if (options.target === 'OpenAPI' && !options.openapiVersion) {
            prompts.push({
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
            prompts.push({
                name: 'output',
                message: 'Enter the path for the output file:',
                filter: (input) => untildify(input),
            })
        }

        if (prompts.length < 1) {
            converter(options)
        } else {
            inquirer.prompt(prompts).then((answers) => {
                const combined = options
                Object.assign(combined, answers)
                converter(combined)
            })
        }
    })
    .parse(process.argv)
