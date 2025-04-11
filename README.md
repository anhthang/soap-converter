# SOAP to REST API Converter

Instantly convert SOAP/WSDL definitions to REST API specifications for use with Postman, OpenAPI/Swagger, and other API development tools. This simplifies integration with modern systems and allows you to leverage the power and flexibility of RESTful APIs.

[![npm](https://flat.badgen.net/npm/v/soap-converter)](https://npm.im/soap-converter)
![download](https://flat.badgen.net/npm/dt/soap-converter)
![license](https://flat.badgen.net/npm/license/soap-converter)

## Features

- Convert SOAP WSDL files into:​
  - **Postman Collection v2.1​**
  - **OpenAPI 2.0 (Swagger), 3.0, and 3.1​**
- Facilitate RESTful interactions with SOAP-based services​
- Compatible with any REST client supporting OpenAPI/Swagger

## Getting Started

### Installation

You can install `soap-converter` globally or locally:​

**Global Installation (Recommended)**:

```bash
yarn global add soap-converter
# or
npm install -g soap-converter
```

**Local Installation**:

```bash
yarn add soap-converter
# or
npm install soap-converter --save-dev
```

### Run the CLI

```bash
soap-converter
# or, if installed locally
npx soap-converter
```

### CLI Flow

1. **Enter a WSDL URL or file path**
2. **Choose output format**:
   - `Postman Collection v2.1`
   - `OpenAPI 2.0 (formerly Swagger 2.0)`
   - `OpenAPI 3`
3. **If OpenAPI selected** → choose version:
   - `OpenAPI 3.0`
   - `OpenAPI 3.1`
4. **Enter full output path including filename** (e.g. `./converted/api.postman.json` or `./converted/api.openapi.json`)

**Example**:

```bash
✔ Enter the URL or path to the WSDL file:
https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php?wsdl

✔ Choose an output format:
❯ Postman Collection v2.1
  OpenAPI 2.0 (formerly Swagger 2.0)
  OpenAPI 3

✔ Choose OpenAPI version:
❯ OpenAPI 3.0
  OpenAPI 3.1

✔ Enter output file path:
./converted/weather.openapi.json
```

## Example Usage

1. Paste your WSDL URL
2. Choose output format & version
3. Set the desired file path
4. Import the file into:
   - **Postman** → Import → Collection
   - **Swagger UI** → Upload OpenAPI file
   - **Other REST tools** → Import as OpenAPI

## Command Line Options

| Option                          | Description                                                                                |
|---------------------------------|--------------------------------------------------------------------------------------------|
| `-i`, `--input`                 | URL or path to the WSDL file (required)                                                    |
| `-t`, `--target`                | Output format: `Postman Collection v2.1`, `OpenAPI 2.0 (formerly Swagger)`, or `OpenAPI 3` |
| `-v`, `--version`               | OpenAPI version (`3.0`, or `3.1`) — required if target is `OpenAPI 3`                      |
| `-o`, `--output`                | Output path including filename (e.g. `./converted/weather.openapi.json`)                   |
| `-k`, `--api-key-header`        | Add a custom API key header name (e.g. `X-API-Key`)                                        |
| `--no-examples`                 | Skip generating example request/response payloads                                          |
| `--no-inline-attributes`        | Avoid embedding XML attributes inline; separates them for better clarity                   |
| `--use-security`                | Enable WS-Security in generated requests                                                   |
| `--use-ibm-datapower-gateway`   | Add IBM DataPower Gateway-specific headers to requests                                     |
| `-h`, `--help`                  | Show help message                                                                          |

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

- **Conversion failed:** Double-check the WSDL URL and ensure it is accessible. Examine the output for any error messages. If the WSDL is complex, try simplifying it or checking for non-standard elements.
- **Authentication issues:** If your SOAP service requires authentication, use the `--api-key-header` option or `--use-security` if WS-Security is applicable.
- **Incorrect output:** Verify the WSDL structure and the chosen target format.

If you encounter any issues, please create an Issue to report the problem, providing as much detail as possible, including the WSDL, the command you used, and any error messages you received. This will help in diagnosing and fixing the issue.

## License

This project is released under the [MIT License](LICENSE). However, it includes dependencies that have different licensing terms. Specifically, it depends on [`apiconnect-wsdl`](https://www.npmjs.com/package/apiconnect-wsdl), which is licensed under the **IBM International Program License Agreement (IPLA)**.  

Users must review and comply with the IPLA before using this package.

By using this project, you acknowledge that some dependencies are subject to IBM’s licensing terms, which may impose additional restrictions beyond the MIT License.
