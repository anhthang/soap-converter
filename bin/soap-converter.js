#!/usr/bin/env node

const inquirer = require('inquirer')
const converter = require('..')

inquirer
    .prompt([
        {
            name: 'input',
            message:
                'What is your WSDL URL (http://example.com/service.svc?wsdl)?'
        },
        {
            name: 'target',
            message: 'Target Description Format',
            type: 'list',
            choices: [
                {
                    name: 'Postman',
                    value: 'Postman'
                },
                {
                    name: 'Insomnia',
                    value: 'Insomnia'
                },
                {
                    name: 'Swagger (JSON)',
                    value: 'SwaggerJSON'
                },
                {
                    name: 'Swagger (YAML)',
                    value: 'SwaggerYAML'
                }
            ]
        },
        {
            name: 'output',
            message:
                'Where do you want to store the output? (~/username/output.json)'
        }
    ])
    .then(answers => {
        converter(answers)
    })
