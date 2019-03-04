"use strict";

const  fs = require('fs');
const express = require('express');

const validation =  require("./validation");

module.exports = async (app) => {
  let config;
  // get a validated config object
  try {
    config = await app.modules.jsonload(`${app.path}/config/http.json`);
    app.config.http = await validation(app, config);
  } catch (e) {
    console.log(e);
    throw e;
  }

  // create an express app for the http server
  const httpServer = express();
  // Define the port to run on
  httpServer.set('port', app.config.http.port);
  // setup static content
  httpServer.use(express.static(app.config.http.root));

  // setup vars REST enponit
  if (app.config.http.rest) {
    httpServer.get(`/${app.config.http.app_vars}`, (req, res) => {
      res.json(app[app.config.http.app_vars]);
    });
  }
  // Listen for requests
  httpServer.listen(app.config.http.port, () => {
    app.modules.logger.log("info",
      `HTTP server http://localhost:${app.config.http.port}`);
    if (app.config.http.rest) {
      app.modules.logger.log("info",
        `REST endpoint http://localhost:${app.config.http.port}/${app.config.http.app_vars} `);
    }
  });


  fs.exists(app.config.http.root, (exists) => {
    if (!exists)
      app.modules.logger.log("error",
      `please write a ${app.config.http.root}/www/index.html file`);
  });
}
