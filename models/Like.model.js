const mongoose = require("mongoose");
const Restaurant = require("./Restaurant.model");
const User = require("./User.model");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
