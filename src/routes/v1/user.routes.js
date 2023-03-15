import express from "express";
import UserController from "../../controllers/user.controller.js";
import AccountMiddleware from "../../middlewares/account.middleware.js";
import PaginateMiddleware from "../../middlewares/paginate.middleware.js";
import UserValidation from "../../validations/user.validation.js";

const router = express.Router();

const userValidation = new UserValidation();
const userController = new UserController();
const accountMiddleware = new AccountMiddleware();
const paginateMiddleware = new PaginateMiddleware();

router.get('/', 
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next), 
  async (req, res, next) => await paginateMiddleware.paginate(req, res, next),
  async (req, res) => await userController.getUsers(req, res));

router.post('/', 
  userValidation.createUser(), 
  async (req, res) => await userController.createUser(req, res));

router.get('/:id',
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next),
  async (req, res) => await userController.getUser(req, res));

router.patch('/:id',
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next),
  userValidation.createUser(),
  async (req, res) => await userController.updateUser(req, res));

router.delete('/:id',
  async (req, res, next) => await accountMiddleware.verifyToken(req, res, next),
  async (req, res) => await userController.deleteUser(req, res));


export default router;