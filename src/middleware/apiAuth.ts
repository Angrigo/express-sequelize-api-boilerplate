import { errorResponse } from '../helpers';
import models from '../models';
import {NextFunction, Request, Response} from "express";
//const User = models.User;

const jwt = require('jsonwebtoken');

const apiAuth = async (req:Request, res:Response, next: NextFunction) => {
  if (!(req.headers && req.headers['x-token'])) {
    return errorResponse(req, res, 'Token is not provided', "NO_TOKEN_PROVIDED", 401);
  }
  const token = req.headers['x-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.body.user = decoded.user;
    const user = {id:1, get: () => {return {userId: 1}}};/*await User.scope('withSecretColumns').findOne({
      where: { email: req.body.user.email },
    });*/
    if (!user) {
      return errorResponse(req, res, 'User is not found in system', "USER_NOT_FOUND", 401);
    }
    const reqUser = { ...user.get() };
    reqUser.userId = user.id;
    req.body.user = reqUser;
    return next();
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Incorrect token is provided, try re-login',
      "INVALID_TOKEN",
      401,
    );
  }
};

export default apiAuth;
