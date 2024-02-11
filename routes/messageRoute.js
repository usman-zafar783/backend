
const express = require('express');
const { createMessage, getMessage } = require('../controllers/messagecontroller');
const Router = express.Router();

Router.post('/', createMessage);
Router.get('/:chatID', getMessage);


module.exports = Router;

