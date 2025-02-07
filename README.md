# SOAP to REST API Converter

Instantly convert SOAP/WSDL definitions to REST API specifications for use with Postman, OpenAPI/Swagger, and other API development tools. This simplifies integration with modern systems and allows you to leverage the power and flexibility of RESTful APIs.

[![npm](https://flat.badgen.net/npm/v/soap-converter)](https://npm.im/soap-converter)
![download](https://flat.badgen.net/npm/dt/soap-converter)
![license](https://flat.badgen.net/npm/license/soap-converter)

## Supported Formats

- Postman Collection v2.1
- OpenAPI 2.0 (formerly Swagger 2.0), 3.0, 3.1

## Installation

```bash
# Global installation (recommended)
yarn global add soap-converter
npm install -g soap-converter

# Local installation
yarn add soap-converter  # Then use npx soap-converter or yarn soap-converter
npm install soap-converter --save-dev # Then use npx soap-converter or node_modules/.bin/soap-converter
````

## Usage

  * Install `soap-converter` globally (recommended) or locally.
  * Run `soap-converter` (or `npx soap-converter` if installed locally).
  * Enter your answers as prompted, or use command-line options (see below).
  * Import the output file into your API tool of choice (e.g., Postman, Swagger UI).

<p align="center">
  <img src="https://github.com/anhthang/soap-converter/blob/main/example.png?raw=true" alt="Screenshot of interactive prompt">
</p>

## Command Line Options

| Option                            | Description                                                                                                                                                                                 |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input <url>`               | The URL of the WSDL file (e.g., `http://example.com/service.svc?wsdl`).                                                                                                                     |
| `-t, --target <type>`             | The target format: `Postman Collection v2.1`, `OpenAPI 2.0` (formerly Swagger), `OpenAPI 3.0`, `OpenAPI 3.1`. If `-v` is not specified and target is OpenAPI, OpenAPI 2.0 is default.       |
| `-v, --openapi-version <version>` | Specify the OpenAPI version to use for the output (e.g., `3.0`, `3.1`). If this option is not provided, OpenAPI 2.0 (formerly Swagger 2.0) is used.                                         |
| `-o, --output <file>`             | The path to the output file (e.g., `service.postman.json`).                                                                                                                                 |
| `-k, --api-key-header <name>`     | The name of the API key header (e.g., `X-API-Key`).                                                                                                                                         |
| `--use-security`                  | Enable WS-Security.                                                                                                                                                                         |
| `--use-ibm-datapower-gateway`     | Enable IBM DataPower Gateway headers.                                                                                                                                                       |
| `--no-examples`                   | Disable generating examples in the output.                                                                                                                                                  |
| `--no-inline-attributes`          | Disable inline attributes in the output.                                                                                                                                                    |
| `-h, --help`                      | Display help information.                                                                                                                                                                   |

## Examples

- Basic conversion to Postman
```bash
soap-converter -i http://example.com/service.svc?wsdl -t Postman -o service.postman.json
```

- Conversion to Swagger (OpenAPI v2)
```bash
soap-converter -i http://example.com/service.svc?wsdl -t Swagger -o service.swagger.json
```

- Conversion to OpenAPI v3.1
```bash
soap-converter -i http://example.com/service.svc?wsdl -t OpenAPI -v 3.1 -o service.openapi.json
```

- Conversion to OpenAPI v3.1 with API key
```bash
soap-converter -i http://example.com/service.svc?wsdl -t OpenAPI -v 3.1 -o service.openapi.json -k MyApiKey
```

- Conversion to OpenAPI v3.0 with no examples
```bash
soap-converter -i http://example.com/service.svc?wsdl -t OpenAPI -v 3.0 -o service.openapi.json --no-examples
```

- Conversion with WS-Security enabled (works with any target)
```bash
soap-converter -i http://example.com/service.svc?wsdl -t OpenAPI -v 3.1 -o service.openapi.json --use-security
```

- Conversion to Postman with IBM DataPower Gateway headers
```bash
soap-converter -i http://example.com/service.svc?wsdl -t Postman -o service.postman.json --use-ibm-datapower-gateway
```

## Handling Complex WSDLs

This tool attempts to handle complex WSDLs, including those with imports and multiple namespaces. However, some unusual or non-standard WSDL structures might not be fully supported.

## Troubleshooting

  * **Conversion failed:** Double-check the WSDL URL and ensure it is accessible. Examine the output for any error messages. If the WSDL is complex, try simplifying it or checking for non-standard elements.
  * **Authentication issues:** If your SOAP service requires authentication, use the `--api-key-header` option or `--use-security` if WS-Security is applicable.
  * **Incorrect output:** Verify the WSDL structure and the chosen target format.

If you encounter any issues, please create an Issue to report the problem, providing as much detail as possible, including the WSDL, the command you used, and any error messages you received. This will help in diagnosing and fixing the issue.

## License

[MIT](LICENSE)