import express from 'express';
const router = express.Router();

router.post('', (req, res) => {
  res.send('post login');
});

export default router;