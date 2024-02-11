
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require("../errors");

const messageSchema = require('../models/messageSchema')
// const users = require("../models/user");


const createMessage = async (req, res) => {
    const { chatID, senderID, text } = req.body;
  
    if (!chatID || !senderID || !text ) {
      throw new BadRequestError("Please provide chatID, senderID or text.");
    }

    try {
      const message = await messageSchema.create({chatID, senderID, text})
      res.status(StatusCodes.OK).json({message});

    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
  };


const getMessage = async (req, res) => {
    const { chatID } = req.params;
  
    if (!chatID ) {
      throw new BadRequestError("Please provide chatID");
    }

    try {
      const message = await messageSchema.find({ chatID })
      res.status(StatusCodes.OK).json({message});

    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
  };

  module.exports = {
    createMessage,
    getMessage
}





