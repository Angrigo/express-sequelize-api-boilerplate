import { BuildOptions, Model } from "sequelize";
export interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  verifyToken: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
  associate: Function;
};
