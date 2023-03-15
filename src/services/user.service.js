import userModel from '../models/user.model.js';
import accountModel from '../models/account.model.js';
import PaginateHelper from '../helpers/paginate.helper.js';
import RedisHelper from '../helpers/redis.helper.js';

export default class UserService {
  constructor() {
    this.userModel = userModel;
    this.accountModel = accountModel;
    this.paginateHelper = new PaginateHelper();
    this.redisHelper = new RedisHelper();
  }

  async getUsers(query) {
    const {
      page,
      limit,
      skip,
      accountNumber,
      registrationNumber
    } = query;

    let dataRedis = {};
    let keyRedis;
    if (!(accountNumber || registrationNumber)) {
      keyRedis = `get-users-page-${page}-limit-${limit}-skip-${skip}`
      dataRedis = await this.redisHelper.getRedis(keyRedis);
    }

    let users = dataRedis?.users
    let meta = dataRedis?.meta

    if (!(users || meta)) {

      let filter = {}
      if (accountNumber) {
        filter['accountNumber'] = {
          $eq: accountNumber
        }
      }

      if (registrationNumber) {
        filter['registrationNumber'] = {
          $eq: registrationNumber
        }
      }

      users = await this.userModel.find(filter).limit(limit).skip(skip);
      let count = await this.userModel.find(filter).countDocuments().exec();

      users = users.map( user => {
        return {
          userId: user._id,
          fullName: user.fullName,
          emailAddress: user.emailAddress,
          accountNumber: user.accountNumber,
          registrationNumber: user.registrationNumber
        };
      });

      meta = this.paginateHelper.createMeta({limit, totalData: count, page })

      if (keyRedis) {
        await this.redisHelper.setRedis({key: keyRedis, data: {users, meta}})
      }
    }

    return {users, meta};
  }

  async createUser(body) {
    let userId;

    try {
      const {
        userName,
        fullName,
        emailAddress,
        password,
        accountNumber,
        registrationNumber
      } = body
      
      const user = await this.userModel.create({
        fullName,
        emailAddress,
        accountNumber,
        registrationNumber
      });
  
      if (!user) {
        throw new Error('failed to create user into database')
      }

      userId = user._id;
  
      const account = await accountModel.create({
        userId,
        userName,
        password,
      })
  
      
      if (!account) {
        throw new Error('failed to create user into database')
      }
  
      return user;
    } catch (error) {
      if (userId) {
        await this.userModel.deleteOne({_id: userId})
      }

      throw new Error(error.message)
    }
  }

  async getUser(id) {
    return await this.userModel.findOne({ _id: id })
  }
  
  async updateUser({id, body}) {
    const {
      fullName,
      emailAddress,
      accountNumber,
      registrationNumber
    } = body;

    const user = await this.userModel.updateOne(
      { _id: id }, 
      {
        fullName,
        emailAddress,
        accountNumber,
        registrationNumber
      }
    );

    if (!user.matchedCount) {
      throw new Error('failed to update user, user not found')
    }

    if (!user || !user.modifiedCount) {
      throw new Error('failed to update user into database')
    };

    return user;
  }
  async deleteUser(id) {
    return await this.userModel.deleteOne({_id: id})
  }
}