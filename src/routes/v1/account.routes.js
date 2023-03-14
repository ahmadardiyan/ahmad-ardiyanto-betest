const express = require("express");
const router = express.Router();

router.post('/login', (req, res) => {
  res.send('post login');
});

module.exports = router;