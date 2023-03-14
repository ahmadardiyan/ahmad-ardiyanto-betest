import UserService from '../services/user.service.js';
import { validationResult } from 'express-validator';

export default class UserController {
  constructor() {
    this.userService = new UserService;
  }

  async getUsers(req, res) {
    const users = await this.userService.getUsers();
    res.send(users);
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
      res.status(201).json({
        status: 'OK',
        message: 'create user successfully',
        data: {
          user
        }
      })
    } catch (error) {
      res.status(400).json({
        status: 'FAILED',
        message: 'failed create user',
        data: {
          error: error.message
        }
      })
    }
  }
}