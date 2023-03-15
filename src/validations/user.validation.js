import { body, query } from "express-validator";

export default class UserValidation {
  createUser() {
    return [
      body('userName')
        .isString().withMessage('userName must be string'),
      body('fullName')
        .isString().withMessage('fullName must be string'),
      body('emailAddress')
        .isEmail().withMessage('emailAddress must be email format'),
      body('password')
        .isLength({ min: 8 }).withMessage('password length must more than 8 character'),
      body('accountNumber')
        .isNumeric().withMessage('accountNumber must be integer'),
      body('registrationNumber')
        .isNumeric().withMessage('registrationNumber must be integer'),
    ];
  };

  getUser() {
    return [
      query('accountNumber')
        .optional()
        .isNumeric().withMessage('accountNumber must be integer'),
      query('registrationNumber')
        .optional()
        .isNumeric().withMessage('registrationNumber must be integer'),
    ]
  }

  createUser() {
    return [
      body('fullName')
        .optional()
        .isString().withMessage('fullName must be string'),
      body('emailAddress')
        .optional()
        .isEmail().withMessage('emailAddress must be email format'),
      body('accountNumber')
        .optional()
        .isNumeric().withMessage('accountNumber must be integer'),
      body('registrationNumber')
        .optional()
        .isNumeric().withMessage('registrationNumber must be integer'),
    ];
  };
};