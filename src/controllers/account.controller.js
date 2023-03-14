import AccountService from '../services/account.service.js'
export default class AccountController {
  constructor() {
    this.accountService = new AccountService;
  }

  async login(req, res) {
    try {
      const {
        userName, password
      } = req.body;

      const result = await this.accountService.login({ userName, password })

      res.status(200).json({
        status: 'OK',
        message: 'login succesfully',
        data: {
          accessToken: result
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
}