import accountModel from "../models/account.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export default class AccountService {
  constructor() {
    this.accountModel = accountModel;
  }

  async login({ userName, password }) {
    try {
      const account = await this.accountModel
                              .findOne({ userName })
                              .populate({ 
                                path: 'user',
                                select: '_id fullName emailAddress'
                              })

      if (!account) {
        throw new Error('failed login! userName not found.');
      }

      const passwordMatch = await this.checkPassword({ inputPassword: password, accountPassword: account.password});

      if (!passwordMatch) {
        throw new Error('failed login! password does not match.')
      }

      const accessToken = await this.generateToken(account);

      if (!accessToken) {
        throw new Error('failed login! failed generate token.')
      }

      account.lastLoginDateTime = Date.now();
      await account.save();

      return accessToken
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkPassword ({inputPassword, accountPassword}) {
    return await bcrypt.compare(inputPassword, accountPassword);
  }

  async generateToken (account) {
    const data = {
      id: account._id,
      userName: account.userName,
      fullName: account.user.fullName,
      emailAddress: account.user.emailAddress
    }

    const accessToken = jwt.sign(data, process.env.SECRET_ACCESS_TOKEN_KEY, { expiresIn: process.env.EXPIRED_ACCESS_TOKEN})

    return accessToken || ''
  }
}