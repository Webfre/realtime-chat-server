const express = require('express');
const router = express.Router();

router.get('/', (reg, res) => {
  res.send('Home page')
})

module.exports = router;