import UserService from '../services/user.service.js';
import { validationResult } from 'express-validator';

export default class UserController {
  constructor() {
    this.userService = new UserService;
  }

  async getUsers(req, res) {
    try {
      const {query} = req;

      let {users, meta} = await this.userService.getUsers(query);
  
      if (!users) {
        users = [];
      }
  
      return res.status(200).json({
        status: 'OK',
        message: 'data users found',
        data: {
          users,
          meta
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

      if (!user) {
        throw new Error('failed create user');
      }
      
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

  async getUser(req, res) {
    try {
      const { id } = req.params

      const user = await this.userService.getUser(id)

      if (!user) {
        throw new Error('data user not found');
      }

      return res.status(200).json({
        status: 'OK',
        message: 'data user found',
        data: {
          user
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed get user',
        data: {
          error: error.message
        }
      })
    }
  }
  
  async updateUser(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
        return;
      }

      const { body } = req;
      const { id } = req.params;

      const result = await this.userService.updateUser({id, body});

      if (!result || !result.modifiedCount) {
        throw new Error('failed update user');
      }
      
      return res.status(200).json({
        status: 'OK',
        message: 'update user successfully',
        data: {}
      })
      
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed update user',
        data: {
          error: error.message
        }
      })
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;

      if (user.userId == id) {
        throw new Error('can not delete yourself');
      };

      const result = await this.userService.deleteUser(id);

      if (!result.deleteCount) {
        throw new Error('failed delete user')
      }

      return res.status(200).json({
        status: 'OK',
        message: 'delete user successfully',
        data: {}
      })

    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed delete user',
        data: {
          error: error.message
        }
      })
    }
  }
}