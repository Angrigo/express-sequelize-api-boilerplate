import { Sequelize, DataTypes as _DataTypes, Model } from "sequelize/types";

type MyModel = typeof Model & {
  associate?: Function; 
}

export default (sequelize: Sequelize, DataTypes: typeof _DataTypes) => {
  const User: MyModel = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      profilePic: {
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'verifyToken', 'isAdmin'] },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ['password', 'verifyToken', 'isAdmin'] },
        },
      },
    },
  );

  User.associate = function (_models: any) {
    // associations can be defined here
  };

  
  return User;
};
