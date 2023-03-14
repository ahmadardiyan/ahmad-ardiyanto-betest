import express from "express";
import UserController from "../../controllers/user.controller.js";
import AccountMiddleware from "../../middlewares/account.middleware.js";
import UserValidation from "../../validations/user.validation.js";

const router = express.Router();

const userValidation = new UserValidation();
const userController = new UserController();
const accountMiddleware = new AccountMiddleware();

router.get('', 
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next), 
  async (req, res) => await userController.getUsers(req, res));

router.post('', 
  userValidation.createUser(), 
  async (req, res) => await userController.createUser(req, res));

export default router;