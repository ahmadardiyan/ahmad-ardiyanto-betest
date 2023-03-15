import { body, query } from "express-validator";

export default class UserValidation {
  login() {
    return [
      body('userName')
        .isString().withMessage('userName must be string'),
      body('password')
        .isLength({ min: 8 }).withMessage('password length must more than 8 character'),
    ];
  };

  getAccounts() {
    return [
      query('lastLoginDay')
        .optional()
        .isInt({ min: 1}),
      query('findLastLoginBy')
        .optional()
        .isIn(["after", "before"])
    ];
  }
};