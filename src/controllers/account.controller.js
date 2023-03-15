import AccountService from '../services/account.service.js'
import { validationResult } from 'express-validator';

export default class AccountController {
  constructor() {
    this.accountService = new AccountService;
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
        return;
      }
      
      const {
        userName, password
      } = req.body;

      const {accessToken, expiredOn} = await this.accountService.login({ userName, password })

      res.status(200).json({
        status: 'OK',
        message: 'login succesfully',
        data: {
          accessToken,
          expiredOn
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: error.message,
        data: {
          error: error.message
        }
      })
    }
  }

  async getAccounts (req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
        return;
      }

      const {query} = req;

      let {accounts, meta} = await this.accountService.getAccounts(query);
  
      if (!accounts) {
        accounts = [];
      }
  
      return res.status(200).json({
        status: 'OK',
        message: 'data accounts found',
        data: {
          accounts,
          meta
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed get accounts',
        data: {
          error: error.message
        }
      })
    }
  }

  async getAccount (req, res) {
    try {
      const { id } = req.params

      const account = await this.accountService.getAccount(id)

      if (!account) {
        throw new Error('data account not found');
      }

      return res.status(200).json({
        status: 'OK',
        message: 'data account found',
        data: {
          account
        }
      })
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed get account',
        data: {
          error: error.message
        }
      })
    }
  }

  async updateAccount (req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
        return;
      }

      const { body } = req;
      const { id } = req.params;

      const result = await this.accountService.updateAccount({id, body});

      if (!result || !result.modifiedCount) {
        throw new Error('failed update account');
      }
      
      return res.status(200).json({
        status: 'OK',
        message: 'update account successfully',
        data: {}
      })
      
    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed update account',
        data: {
          error: error.message
        }
      })
    }
  }

  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;

      if (user.accountId == id) {
        throw new Error('can not delete yourself');
      };

      const result = await this.accountService.deleteAccount(id);

      if (!result.deleteCount) {
        throw new Error('failed delete account')
      }

      return res.status(200).json({
        status: 'OK',
        message: 'delete account successfully',
        data: {}
      })

    } catch (error) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'failed delete account',
        data: {
          error: error.message
        }
      })
    }
  }
}