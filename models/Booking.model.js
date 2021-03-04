const mongoose = require("mongoose");
const Restaurant = require("./Restaurant.model");
const User = require("./User.model");

const bookingSchema = new mongoose.Schema(
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
    date:{
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
