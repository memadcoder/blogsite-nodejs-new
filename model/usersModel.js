const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email:{
        type: String,
    },
    password:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
