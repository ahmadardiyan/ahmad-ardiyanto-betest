import express from "express";
import UserController from "../../controllers/user.controller.js";
import UserValidation from "../../validations/user.validation.js";

const router = express.Router();

const userValidation = new UserValidation();
const userController = new UserController();

router.get('', async (req, res) => await userController.getUsers(req, res));
router.post('', userValidation.createUser(), async (req, res) => await userController.createUser(req, res));

export default router;