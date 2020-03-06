#!/usr/bin/env node

const inquirer = require('inquirer')
const program = require('commander')
const untildify = require('untildify')
const converter = require('..')

function isAllowedValue(regExpStr) {
    // return a function which checks the value is in the allowedValues
    return value => {
        if (!RegExp(regExpStr).test(value)) {
            throw Error(`Invalid option value: ${value}`)
        }

        return value
    }
}

program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .option(
        '-i, --input <url>',
        'wsdl url (e.g. http://example.com/service.svc?wsdl)'
    )
    .option(
        '-t, --target <Postman|SwaggerJSON|SwaggerYAML>',
        'target type',
        isAllowedValue('^(Postman|SwaggerJSON|SwaggerYAML)$')
    )
    .option('-o, --output <file>', 'output file (e.g. ~/output.json)')
    .action(options => {
        const prompts = []

        if (!options.input) {
            prompts.push({
                name: 'input',
                message:
                    'What is your WSDL URL (http://example.com/service.svc?wsdl)?'
            })
        }

        if (!options.target) {
            prompts.push({
                name: 'target',
                message: 'Target Description Format',
                type: 'list',
                choices: [
                    {
                        name: 'Postman v2.0',
                        value: 'Postman'
                    },
                    {
                        name: 'OpenAPI/Swagger v2.0 (JSON)',
                        value: 'SwaggerJSON'
                    },
                    {
                        name: 'OpenAPI/Swagger v2.0 (YAML)',
                        value: 'SwaggerYAML'
                    }
                ]
            })
        }

        if (!options.output) {
            prompts.push({
                name: 'output',
                message:
                    'Where do you want to store the output? (~/output.json)',
                filter: input => untildify(input)
            })
        }

        if (prompts.length < 1) {
            converter(options)
        } else {
            inquirer.prompt(prompts).then(answers => {
                const combined = options
                Object.assign(combined, answers)
                converter(combined)
            })
        }
    })
    .parse(process.argv)
