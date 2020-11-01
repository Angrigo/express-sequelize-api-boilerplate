import express from 'express';
import { validate } from 'express-validation';
import { successResponse } from '../helpers';

import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../controllers/user/user.validator';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.all(
  '/',
  (req, res) => successResponse(req, res, process.env.APP_NAME)
);
router.post(
  '/login',
  validate(userValidator.login),
  userController.login,
);
router.post(
  '/register',
  validate(userValidator.register),
  userController.register,
);
router.post(
  '/newPassword',
  validate(userValidator.newPassword),
  userController.newPassword,
);


export default router;
