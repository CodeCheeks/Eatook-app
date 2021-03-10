const mongoose = require("mongoose");
const Restaurant = require("./Restaurant.model");
const User = require("./User.model");
const axios = require('axios');

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
    },
    codeQR: {
      type: [String]
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

bookingSchema.pre('save', function(next) {
  this.codeQR = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this._id}`
  next()

})
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
