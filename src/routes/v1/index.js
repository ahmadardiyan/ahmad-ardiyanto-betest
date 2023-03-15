import express from 'express'
import userRoutes from './user.routes.js'
import accountRoutes from './account.routes.js'
import AccountController from '../../controllers/account.controller.js';
import AccountValidation from "../../validations/account.validation.js";

const router = express.Router();
const accountController = new AccountController()
const accountValidation = new AccountValidation();

router.route('/').get((req, res) => {
  res.send(`Hello from route v1!`);
});

router.post('/login', 
  accountValidation.login(),
  async (req, res) => await accountController.login(req, res));

router.use('/accounts', accountRoutes)
router.use('/users', userRoutes)

export default router;