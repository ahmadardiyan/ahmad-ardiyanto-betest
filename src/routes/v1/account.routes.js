import express from 'express';
import AccountController from '../../controllers/account.controller.js';

const router = express.Router();
const accountController = new AccountController()

router.post('/login', async (req, res) => await accountController.login(req, res));

export default router;