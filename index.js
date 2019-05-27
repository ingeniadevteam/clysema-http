"use strict";

const  fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

const validation =  require("./validation");

const getUnauthorizedResponse = (req) => {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
    return 'auth failed'
}

module.exports = async (app) => {
  let config, users, auth;
  // get a validated config object
  try {
    config = await app.modules.jsonload(`${app.path}/config/http.json`);
    config.http = await validation(app, config);
  } catch (e) {
    console.log(e);
    throw e;
  }

  // check if there is auth env variables
  if (process.env.USERNAME && process.env.PASSWORD) {
    users = {};
    users[`${process.env.USERNAME}`] = process.env.PASSWORD;
    auth = basicAuth({
      users,
      challenge: true,
      unauthorizedResponse: getUnauthorizedResponse
    });
  } else {
    // no Auth
    auth = (req, res, next) => next();
  }

  // create an express app for the http server
  const Express = express();

  if (config.http.root) {
    // setup static content
    const exists = fs.existsSync(config.http.root);
    if (exists) {
      try {
        Express.get(`/`, auth, (req, res, next) => next());
        Express.use(`/`, express.static(config.http.root));
      } catch (e) {
        console.log(e);
      }
    } else {
      app.modules.logger.log("error",
        `http root ${config.http.root} does not exists`);
    }
  }

  // setup vars REST enponit
  if (config.http.rest) {
    if (config.http.get) {
      for (let get of config.http.get) {
        Express.get(`/${get}`, auth, (req, res) => {
          res.json(app[get]);
        });
      }
    }
    if (config.http.post) {
      Express.use(bodyParser.json()); // support json encoded bodies

      for (let post of config.http.post) {
        Express.post(`/${post}`, auth, (req, res) => {
          app[`${post}`] = req.body;
          res.end();
        });
      }
    }
  }

  // Listen for requests
  const server = Express.listen(config.http.port,
      config.http.host, () => {
        const add = server.address();
        if (config.http.root) {
          app.modules.logger.log("info",
            `HTTP server http://${add.address}:${add.port}`);
        }
        if (config.http.rest) {
          if (config.http.get) {
            app.modules.logger.log("info",
              `GET endpoints http://${add.address}:${add.port}/${config.http.get}`);
          }
          if (config.http.post) {
            app.modules.logger.log("info",
              `POST endpoints http://${add.address}:${add.port}/${config.http.post}`);
          }
        }
  });

  return server;
}
