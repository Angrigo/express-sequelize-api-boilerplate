import { errorResponse } from '../helpers';
import {NextFunction, Request, Response} from "express";

const adminAuth = async (req:Request, res:Response, next: NextFunction) => {
  if (req.body.user && req.body.user.email && req.body.user.isAdmin) {
    return next();
  }
  return errorResponse(req, res, "You don't have admin access", "NO_ACCESS", 401);
};

export default adminAuth;
