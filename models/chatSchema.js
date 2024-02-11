
const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  members: {
    type: Array,
    required: true 
 },
},{timestamps:true});


module.exports = mongoose.model("Chat", chatSchema);
