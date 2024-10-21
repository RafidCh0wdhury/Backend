const express = require('express');
const { login, signup } = require('../controllers/user');

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);


module.exports = router;

//http: get, post, put, delete
