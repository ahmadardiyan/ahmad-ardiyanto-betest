import express from 'express';
import AccountController from '../../controllers/account.controller.js';
import AccountValidation from "../../validations/account.validation.js";

const router = express.Router();
const accountController = new AccountController()
const accountValidation = new AccountValidation();

router.post('/login', 
  accountValidation.login(),
  async (req, res) => await accountController.login(req, res));

export default router;