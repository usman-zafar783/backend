
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({

  chatID: String,
  senderID: String,
  text: String,

},{timestamps:true});


module.exports = mongoose.model("Message", messageSchema);
