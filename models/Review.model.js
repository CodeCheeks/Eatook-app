const mongoose = require("mongoose");
const Restaurant = require("./Restaurant.model");
const User = require("./User.model");

const reviewSchema = new mongoose.Schema(
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
    comment: {
       type: String,
       default: 'This entry has no comments'
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5    
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;