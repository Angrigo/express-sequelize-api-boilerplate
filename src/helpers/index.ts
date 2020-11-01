import {Request, Response} from "express";

export const successResponse = (req:Request, res:Response, data?: any, code = 200) => res.status(code).send({
  code,
  data,
  success: true,
});

export const errorResponse = (
  req: Request,
  res: Response,
  errorMessage = 'Something went wrong',
  textCode = "GENERIC_ERROR",
  code = 500,
  error = {},
) => {
  res.status(code).json({
    code,
    errorMessage,
    textCode,
    error,
    data: null,
    success: false,
  })
};

export const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateFields = (object: { [x: string]: any; }, fields: any[]) => {
  const errors: any[] = [];
  fields.forEach((f: string | number) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(', ')} are required fields.` : '';
};

export const uniqueId = (length = 13) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
