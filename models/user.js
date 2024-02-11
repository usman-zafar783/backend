const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Must provide Username"],
    minlength: 3,
    maxlength: 20,
    unique: true
  },

  email: {
    type: String,
    required: [true, "Must provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid email address",
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Must provide password"],
    minlength: 6,
  },

  profile_photo: {
    type: String,
    default: null,
    minlength: 12
  },
  address: {
    type: String,
    default: null
  },
  company: {
    type: String,
    default: null
  },
  isVerified:{
    type: Boolean,
    default: false
  }
});


userSchema.pre("save", async function () {
  try {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
  }
});


userSchema.method("Create_JWT", function () {
  return jwt.sign(
    { name: this.name, id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
});

userSchema.method('comparePassword', function(encodedPassword){  
  return bcrypt.compare(encodedPassword, this.password)
})

module.exports = mongoose.model("users", userSchema);
