import UserService from '../services/user.service.js';
import { validationResult } from 'express-validator';

export default class UserController {
  constructor() {
    this.userService = new UserService;
  }

  async getUsers(req, res) {
    try {
      let users = await this.userService.getUsers();
  
      if (!users) {
        users = [];
      }
  
      return res.status(200).json({
        status: 'OK',
        message: 'data users found',
        data: {
          users
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed create user',
        data: {
          error: error.message
        }
      })
    }
  }

  async createUser(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
        return;
      }

      const { body } = req;
      const user = await this.userService.createUser(body);
      return res.status(201).json({
        status: 'OK',
        message: 'create user successfully',
        data: {
          user
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed create user',
        data: {
          error: error.message
        }
      })
    }
  }
}