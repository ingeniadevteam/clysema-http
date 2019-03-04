"use strict";

const joi = require('joi');

const httpSchema = joi.object({
  root: joi.string().required(),
  port: joi.number().default(4000),
  rest: joi.boolean().default(true),
  app_vars: joi.string().default('vars')
}).unknown();


module.exports = async function (app, obj) {
  let extObj;
  if (!Object.keys(obj).length || !obj.hasOwnProperty('root')) {
    extObj = Object.assign({
      root: `${app.path}/www`
    }, obj);
  }
  // validate the config object
  const validation = joi.validate(extObj, httpSchema);
  if (validation.error) {
    const errors = [];
    validation.error.details.forEach( detail => {
      errors.push(detail.message);
    });
    // process failed
    throw new Error(`http config validation error: ${errors.join(", ")}`);
  }

  return validation.value;
};
