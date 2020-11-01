import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import models from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';
import CustomError from '../../helpers/CustomError';
import Mailer from '../../helpers/mailer/index.js';
import {Request, Response} from "express";

const User = models.User;

export const allUsers = async (req:Request, res:Response) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 2;
    const users = await User.findAndCountAll({
      order: [['createdAt', 'DESC'], ['firstName', 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};

export const register = async (req:Request, res:Response) => {
  try {
    const {
      email, password, firstName, lastName,
    } = req.body;

    const user = await User.scope('withSecretColumns').findOne({
      where: { email },
    });
    if (user) {
      throw new CustomError('User already exists with same email', "USER_ALREADY_EXISTS");
    }

    const reqPass = await bcrypt.hash(password, 8);
    const payload = {
      email,
      firstName,
      lastName,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
    };

    const newUser = await User.create(payload);
    if (newUser) Mailer.getInstance().sendEmail(payload.email, "Verifica il tuo account", "verifyAccount", { verifyToken: payload.verifyToken, url: "http://test/" })

    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};

export const login = async (req:Request, res:Response) => {
  try {
    const user = await User.scope('withSecretColumns').findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new CustomError('Incorrect Email or password', "INVALID_LOGIN");
    }
    if (!user.isVerified) {
      throw new CustomError('You need to verify your account to login', "NOT_VERIFIED");
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw new CustomError("Incorrect Email or password", "INVALID_LOGIN");
    }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET || "",
    );
    delete user.dataValues.password;
    return successResponse(req, res, { user, token });
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};

export const profile = async (req:Request, res:Response) => {
  try {
    const { userId } = req.body.user;
    const user = await User.findOne({ where: { id: userId } });
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};

export const changePassword = async (req:Request, res:Response) => {
  try {
    const { userId } = req.body.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw new CustomError('Old password is incorrect', "INVALID_PASSWORD");
    }

    const newPass = await bcrypt.hash(req.body.newPassword, 8);

    await User.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};

export const newPassword = async (req:Request, res:Response) => {
  try {
    const user = await User.scope('withSecretColumns').findOne({
      where: { email: req.body.email },
    });

    if (user) {
      const randomPass = Math.random().toString(36).substring(7).toUpperCase();
      const newPass = await bcrypt.hash(randomPass, 8);
      await User.update({ password: newPass }, { where: { id: user.id } });
      Mailer.getInstance().sendEmail(req.body.email, "Nuova email", "newPassword", { password: randomPass, firstname: user.firstName })
    }

    return successResponse(req, res);
  } catch (error) {
    console.log(error)
    return errorResponse(req, res, error.message, error.code);
  }
};

export const verifyAccount = async (req:Request, res:Response) => {
  try {
    const user = await User.scope('withSecretColumns').findOne({
      where: { email: req.body.email },
    });

    if (user.verifyToken === req.body.verifyToken) {
      await User.update({ isVerified: true, verifyToken: "" }, { where: { id: user.id } });
      Mailer.getInstance().sendEmail(req.body.email, "Account verificato", "verifiedAccount", { firstname: user.firstName })
    }

    return successResponse(req, res);
  } catch (error) {
    return errorResponse(req, res, error.message, error.code);
  }
};
