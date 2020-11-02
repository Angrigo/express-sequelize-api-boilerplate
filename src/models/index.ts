import path from "path";
import Sequelize, { DataTypes, Model } from "sequelize";
import UserFactory from "./user";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/config.js`)[env];

let sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logQueryParameters: true,
  }
);

const User = UserFactory(sequelize);

export const models = {
  User,
};

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models);
  }
  return model;
});

sequelize.sync();

const db = {
  sequelize,
  Sequelize,
  models,
};

export default db;
