# @clysema/http

[![npm (scoped)](https://img.shields.io/npm/v/@clysema/http.svg)](https://www.npmjs.com/package/@clysema/http)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@clysema/http.svg)](https://www.npmjs.com/package/@clysema/http)

Serves static content and a REST endpoint.

Can be used to create a local user interface.

## Install

```
$ npm install @clysema/http
```

## Usage

config/http.json
```json
{
  "root": "/home/pi/www",
  "port": 4000,
  "rest": true,
  "app_vars": "vars"
}
```

Will serve static content in `/home/pi/www`.
The REST endpoint will return `app.vars`

Anywhere in the app code:
```js
// (simply setup app.vars  object)
app.vars = { date: new Date() };
```
