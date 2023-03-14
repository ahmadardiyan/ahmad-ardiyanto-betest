import express from 'express'
import userRoutes from './user.routes.js'
import accountRoutes from './account.routes.js'

const router = express.Router();

router.route('/').get((req, res) => {
  res.send(`Hello from route v1!`);
});

router.use('/accounts', accountRoutes)
router.use('/users', userRoutes)

export default router;