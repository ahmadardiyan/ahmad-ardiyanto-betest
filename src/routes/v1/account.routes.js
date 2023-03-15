import express from 'express';
import AccountController from '../../controllers/account.controller.js';
import AccountValidation from "../../validations/account.validation.js";

const router = express.Router();
const accountController = new AccountController();
const accountValidation = new AccountValidation();


export default router;