# @clysema/http

[![npm (scoped)](https://img.shields.io/npm/v/@clysema/http.svg)](https://www.npmjs.com/package/@clysema/http)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@clysema/http.svg)](https://www.npmjs.com/package/@clysema/http)

Serves or HTTP static content and/or a REST GET/POST endpoints.
Can be used to create a local user interface.
Basic Auth.

## Install

```
$ npm install @clysema/http
```

## Usage

config/http.json
```json
{
  "root": "/home/pi/www",
  "host": "localhost",
  "port": 4000,
  "rest": true,
  "get": ["vars"],
  "post": ["controls"]
}
```

If `root` property exis, will serve static content placed in `/home/pi/www` on http://localhost:4000.

If `rest` is `true` and `get` list is defined, a GET in http://localhost:4000/vars endpoint will return `app.vars` in this example.

If `rest` is `true` and `post` list is defined, a POST in  http://localhost:4000/controls  will write `app.controls` (in this example) with the data supplied.

Anywhere in the app code:
```js
// (simply setup app.vars  object) for the get endpoint
app.vars = { date: new Date() };
// log the controls
console.log(app.controls);
```

## Test using cURL

GET
```bash
curl http://localhost:4000/vars
```

POST
```bash
curl --header "Content-Type: application/json" --request POST --data '{"a":"1","b":"2"}' http://localhost:4000/controls
```

## Security

Only allow local requests (recommended):

config/http.json
```json
{
  "host": "localhost"
}
```

Allow requests from anywhere:

config/http.json
```json
{
  "host": "0.0.0.0"
}
```

### Basic Auth

Put the username and password in env variables and the run the controller app.

Example:
```bash
USERNAME=test PASSWORD=test npm start
```

## Test

GET/controls
```bash
curl -u test:test http://localhost:4000/controls
```

PUT/controls
```bash
curl -d '{"a":3, "b":3}' -u test:test -H "Content-Type: application/json" -X POST http://localhost:4000/controls
```
