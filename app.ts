import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';

import publicRoutes from './src/routes/public';
import apiRoutes from './src/routes/api';
import adminRoutes from './src/routes/admin';
import apiMiddleware from './src/middleware/apiAuth';
import adminMiddleware from './src/middleware/adminAuth';
import errorHandler from './src/middleware/errorHandler';
import Mailer from './src/helpers/mailer';
import mailerConfig from './src/config/mailer';

//.env file vars
dotenv.config();

//mailer
Mailer.initialize(null);

//sequelize
require('./src/config/sequelize');

//express
const app = express();
//read json body
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

//apply middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/pub', publicRoutes);
app.use('/api', apiMiddleware, apiRoutes);
app.use('/api/admin', apiMiddleware, adminMiddleware, adminRoutes);
app.use(errorHandler);

export default app;
