import userModel from '../models/user.model.js';
import accountModel from '../models/account.model.js';
import PaginateHelper from '../helpers/paginate.helper.js';

export default class UserService {
  constructor() {
    this.userModel = userModel;
    this.accountModel = accountModel;
    this.paginateHelper = new PaginateHelper()
  }

  async getUsers(query) {
    const {
      page,
      limit,
      skip,
      accountNumber,
      registrationNumber
    } = query

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

    let count = await userModel.find(filter).countDocuments().exec();
    let users = await userModel.find(filter).limit(limit).skip(skip);

    users = users.map( user => {
      return {
        userId: user._id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        accountNumber: user.accountNumber,
        registrationNumber: user.registrationNumber
      };
    });

    const meta = this.paginateHelper.createMeta({limit, totalData: count, page })

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
      
      const user = await userModel.create({
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
        await userModel.deleteOne({_id: userId})
      }

      throw new Error(error.message)
    }
  }

  async getUser(id) {
    return await this.userModel.findOne({_id: id})
  }
  
  async updateUser({id, body}) {
    
  }
  async deleteUser(id) {

  }
}