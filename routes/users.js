const router = require('express').Router();
const { getUserMe } = require('../controllers/users');

router.get('/me', getUserMe);

module.exports = router;
