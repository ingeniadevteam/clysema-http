"use strict";

const joi = require('joi');

const httpSchema = joi.object({
  root: joi.string().optional(),
  host: joi.string().default('localhost'),
  port: joi.number().default(4000),
  rest: joi.boolean().default(true),
  get: joi.array().items(joi.string()).default(['vars', 'controls']),
  post: joi.array().items(joi.string()).default(['controls'])
}).unknown();


module.exports = async function (app, obj) {
  if (!obj) obj = {};

  // validate the config object
  const validation = joi.validate(obj, httpSchema);
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
