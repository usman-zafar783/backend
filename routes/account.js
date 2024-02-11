
const express = require('express');
const Router = express.Router();
const { register, login, forgotPassword, verifyResetPasswordToken, resetPassword } = require('../controllers/account');


Router.post('/register', register);
Router.post('/login', login);
Router.post('/forgot-password', forgotPassword);
Router.post('/verifyResetPasswordToken', verifyResetPasswordToken);
Router.post('/reset-password', resetPassword);


module.exports = Router;
