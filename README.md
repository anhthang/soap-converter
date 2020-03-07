# SOAP Converter

> Transform SOAP/WSDL descriptions to formats of your choice

[![npm](https://flat.badgen.net/npm/v/soap-converter)](https://npm.im/soap-converter)
![download](https://flat.badgen.net/npm/dt/soap-converter)
![license](https://flat.badgen.net/npm/license/soap-converter)

## Supported Formats

- Postman v2.0
- OpenAPI/Swagger v2.0 (JSON)
- OpenAPI/Swagger v2.0 (YAML)

## Install
```
yarn global add soap-converter
# npm i -g soap-converter
```

## Usage
* Install `soap-converter` as global
* Run `soap-converter`
* Enter your answers like image below and import output file to Postman

<p align="center">
  <img src="https://github.com/buianhthang/soap-converter/raw/master/example.png" alt="png">
</p>

### Command Line Options

    Usage: soap-converter [options]

    Options:
      -i, --input <url>                               wsdl url (e.g. http://example.com/service.svc?wsdl)
      -t, --target <Postman|SwaggerJSON|SwaggerYAML>  target type
      -o, --output <file>                             output file (e.g. ~/output.json)
      -k, --api-key-header <name>                     specify an apiKey header name (e.g. 'X-API-Key')
      --use-security                                  enable generating wssecurity
      --use-ibm-datapower-gateway                     enable IBM DataPower Gateway headers (default: false)
      --no-examples                                   disable generating examples
      --no-inline-attributes                          disable inline attributes
      -h, --help                                      output usage information

Example: `soap-converter --input http://example.com/service.svc\?wsdl --target SwaggerJSON --output ~/service.swagger.json --api-key-header X-API-Key`

## License
MIT - [Anh Thang Bui][me]

[me]: https://anhthang.org