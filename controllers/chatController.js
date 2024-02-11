
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require("../errors");

const chatSchema = require('../models/chatSchema')
const users = require("../models/user");
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const multer = require('multer');


const createChat = async (req, res) => {
    const { firstID, secondID } = req.body;
  
    if (!firstID || !secondID ) {
      throw new BadRequestError("Please provide both users ID's");
    }

    try {
      const chat = await chatSchema.findOne({
        members: {$all: [firstID, secondID]}
      })

      if(chat) return res.status(StatusCodes.OK).json({chat});

      const newChat = await chatSchema.create({
        members: [firstID, secondID]
      })

      res.status(StatusCodes.OK).json({newChat});

    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
  };


  const findUserChats = async (req, res) => {
    const  userID = req.params.userID;

    try {
      const chats = await chatSchema.find({
        members: {$in: [userID]}
      })
      res.status(StatusCodes.OK).json({chats});

    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
  };


  const findChat = async (req, res) => {
    const { firstID, secondID } = req.params;

    try {
      const chat = await chatSchema.find({
        members: {$all: [firstID, secondID]}
      })
      res.status(StatusCodes.OK).json({chat}); 

    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
  };


  const getAllusers = async (req, res) => {
    let result = await users.find();
    if (!result) {
      throw new UnauthenticatedError("Error while fetching data");
    }
    res.status(StatusCodes.OK).json({result});
  };

  
  const findUser = async (req, res) => {
    const {userID} = req.params;
    let result = await users.findOne({_id:userID});

    if (!result) {
      throw new UnauthenticatedError("Error while fetching data");
    }
    res.status(StatusCodes.OK).json({result});
  }


  /// Update profile


  
const updateProfile = async (req, res) =>{
  const userInfo = await user.findById(req.user.userID);

  /// Check if user exists or not!
  if(userInfo){
      const data = req.body;
      const allowedKeys = ['name', 'email', 'password', 'profile_photo', 'address', 'company', 'public_id'];
      const cleanData = {};

      allowedKeys.map(ele =>{
      if(data[ele]!==null && data[ele]!==undefined && data[ele]!==''){
          cleanData[ele] = data[ele]
      }})
      
      
      if(cleanData.password){
        const password = userInfo.password;
        const comparePassword = await userInfo.comparePassword(data.old_password);
        if (!comparePassword) {
          throw new BadRequestError("Invalid Credentials");
        }
        let salt = await bcrypt.genSalt(10);
        cleanData.password = await bcrypt.hash(data.password, salt);
      }

      console.log(cleanData);
  
      let result = await user.findByIdAndUpdate({_id : req.user.userID}, {...cleanData}, {runValidators: true, new: true})
  
      return res.status(StatusCodes.OK).json({result});

  }

  throw new BadRequestError('Invalid User!');
}


  
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'uploads')
    },
    filename: function(req ,file, cb){
      cb(null, 'avatar-'+file.fieldname+Date.now()+'.jpg')
    }
  })
}).single('profile_photo')


module.exports = {
    createChat,
    findUserChats,
    findChat,
    getAllusers,
    findUser,
    updateProfile,
    upload
}

