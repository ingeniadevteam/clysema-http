"use strict";

const  fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

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
  const Express = express();

  if (app.config.http.root) {
    // setup static content
    fs.exists(app.config.http.root, (exists) => {
      if (exists) {
        Express.use(express.static(app.config.http.root));
      } else {
        app.modules.logger.log("error",
          `http root ${app.config.http.root} does not exists`);
      }
    });
  }

  // setup vars REST enponit
  if (app.config.http.rest) {
    if (app.config.http.get) {
      Express.get(`/${app.config.http.get}`, (req, res) => {
        res.json(app[app.config.http.get]);
      });
    }
    if (app.config.http.post) {
      Express.use(bodyParser.json()); // support json encoded bodies

      Express.post(`/${app.config.http.post}`, (req, res) => {
        app[`${app.config.http.post}`] = req.body;
        res.end();
      });
    }
  }

  // Listen for requests
  const server = Express.listen(app.config.http.port,
      app.config.http.host, () => {
        const add = server.address();
        if (app.config.http.root) {
          app.modules.logger.log("info",
            `HTTP server http://${add.address}:${add.port}`);
        }
        if (app.config.http.rest) {
          if (app.config.http.get) {
            app.modules.logger.log("info",
              `GET endpoint http://${add.address}:${add.port}/${app.config.http.get}`);
          }
          if (app.config.http.post) {
            app.modules.logger.log("info",
              `POST endpoint http://${add.address}:${add.port}/${app.config.http.post}`);
          }
        }
  });
}
