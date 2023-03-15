import express from 'express';
import AccountController from '../../controllers/account.controller.js';
import AccountValidation from "../../validations/account.validation.js";
import AccountMiddleware from "../../middlewares/account.middleware.js";
import PaginateMiddleware from "../../middlewares/paginate.middleware.js";

const router = express.Router();
const accountController = new AccountController();
const accountValidation = new AccountValidation();
const accountMiddleware = new AccountMiddleware();
const paginateMiddleware = new PaginateMiddleware();

router.get('/',
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next), 
  async (req, res, next) => await paginateMiddleware.paginate(req, res, next),
  accountValidation.getAccounts(),
  async (req, res) => await accountController.getAccounts(req, res)
)

export default router;