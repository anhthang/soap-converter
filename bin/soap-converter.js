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
