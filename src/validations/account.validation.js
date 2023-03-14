import { body } from "express-validator";

export default class UserValidation {
  login() {
    return [
      body('userName')
        .isString().withMessage('userName must be string'),
      body('password')
        .isLength({ min: 8 }).withMessage('password length must more than 8 character'),
    ];
  };
};