import AccountService from "../services/account.service.js";

export default class AccountMiddleware {
  constructor() {
    this.accountService = new AccountService()
  }

  async verifyToken(req, res, next) {
    try {
      const header = req.headers['authorization'];
      const token = header && header.split(' ')[1];
    
      if(!token) {
        return res.status(401).json({
          status: 'FAILED',
          message: 'unauthorized',
          data: {
            error: 'unauthorized'
          }
        })
      }
    
      const payload = await this.accountService.verifyToken(token)

      req.user = payload
      next();
    } catch (error) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'forbidden access',
        data: {
          error: 'forbidden access'
        }
      })
    }
  }
}