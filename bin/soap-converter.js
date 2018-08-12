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
            name: 'output',
            message: 'Where you want to store output?'
        },
        {
            name: 'filename',
            message: 'What is file name of output?'
        }
    ])
    .then(answers => {
        converter(answers)
    })
