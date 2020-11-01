const Joi = require('joi');

export const getOtherUserProfile = {
  body: Joi.object({
    userId: Joi.number().required(),
  }),
};

export const changePassword = {
  body: Joi.object({
    oldPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    newPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }),
};

export const newPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const register = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }),
};
