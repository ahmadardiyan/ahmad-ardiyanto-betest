import accountModel from "../models/account.model.js";
import PaginateHelper from '../helpers/paginate.helper.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export default class AccountService {
  constructor() {
    this.accountModel = accountModel;
    this.paginateHelper = new PaginateHelper();
  }

  async login({ userName, password }) {
    try {
      const account = await this.accountModel
                              .findOne({ userName })
                              .populate({ 
                                path: 'userId',
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

      const decoded = jwt.decode(accessToken);
      const expiredOn = decoded.exp

      account.lastLoginDateTime = Date.now();
      await account.save();

      return {accessToken, expiredOn}
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkPassword ({inputPassword, accountPassword}) {
    return await bcrypt.compare(inputPassword, accountPassword);
  }

  async generateToken (account) {
    const data = {
      accountId: account._id,
      userId: account.userId._id,
      userName: account.userName,
      fullName: account.userId.fullName,
      emailAddress: account.userId.emailAddress
    }

    const accessToken = await jwt.sign(data, process.env.SECRET_ACCESS_TOKEN_KEY, { expiresIn: process.env.EXPIRED_ACCESS_TOKEN})

    return accessToken || ''
  }

  async verifyToken (token) {
    const payload = await jwt.verify(token, process.env.SECRET_ACCESS_TOKEN_KEY)
    
    return payload;
  }

  async getAccounts (query) {
    const {
      page,
      limit,
      skip,
      lastLoginDay,
      findLastLoginBy
    } = query;

    let filter = {};
    if (lastLoginDay) {

      const dayValue = 24 * 60 * 60 * 1000;
      const day = new Date(Date.now() - (lastLoginDay * dayValue))

      let valueFilter = {
        $gte: day
      }

      if (findLastLoginBy == 'after') {
        valueFilter = {
          $lte: day
        }
      }

      filter['lastLoginDateTime'] = valueFilter
    }


    let count = await this.accountModel.find(filter).countDocuments().exec();
    let accounts = await this.accountModel.find(filter)
                            .populate({ 
                              path: 'userId',
                              select: '_id'
                            })
                            .limit(limit)
                            .skip(skip);

    accounts = accounts.map( account => {
      return {
        accountId: account._id,
        userId: account.userId._id,
        userName: account.userName,
        lastLoginDateTime: account.lastLoginDateTime
      }
    });

    const meta = this.paginateHelper.createMeta({limit, totalData: count, page })
    return {accounts, meta};
  }
}