import userModel from '../models/user.model.js';
import accountModel from '../models/account.model.js';

export default class UserService {
  constructor() {
    this.userModel = userModel;
    this.accountModel = accountModel;
  }

  async getUsers() {
    let users = await userModel.find();
    users = users.map( user => {
      return {
        userId: user._id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        accountNumber: user.accountNumber,
        registrationNumber: user.registrationNumber
      };
    });

    return users;
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
        userId: {
          _id: userId
        },
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

}