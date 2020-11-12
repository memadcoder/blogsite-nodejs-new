const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    date: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    featured:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
