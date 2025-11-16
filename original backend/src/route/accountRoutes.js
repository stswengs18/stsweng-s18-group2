// src/route/accountRoutes.js

const express = require('express');
const router = express.Router();

const { createAccount } = require('../controller/createAccountController');

const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/create-account', isAuthenticated, createAccount);

module.exports = router;
