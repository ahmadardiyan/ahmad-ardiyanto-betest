const express = require('express');
const userRoutes = require('./user.routes');
const accountRoutes = require('./account.routes');

const router = express.Router();

router.route('/').get((req, res) => {
  res.send(`Hello from route v1!`);
});

router.use('/accounts', accountRoutes)
router.use('/users', userRoutes)

module.exports = router;