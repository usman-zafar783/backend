
const express = require('express');
const { createChat, findUserChats, findChat, getAllusers, findUser, updateProfile, upload } = require('../controllers/chatController');
const Router = express.Router();

Router.post('/', createChat);
Router.get('/chat/:firstID/:secondID', findChat);
Router.get('/get-users', getAllusers);
Router.get('/find-user/:userID', findUser);
Router.route('/update-profile').patch(upload, updateProfile);
Router.get('/:userID', findUserChats);


module.exports = Router;

