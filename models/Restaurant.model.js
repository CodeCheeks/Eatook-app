const mongoose = require("mongoose");
const User = require("./User.model");
const Booking = require("./Booking.model");
const Review = require("./Review.model");
const faker = require('faker');
const axios = require('axios');

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const restaurantSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true
        },
        adress:{
            country: {
                type: String,
                required: false,
                lowercase: true
            },
            city: {
                type: String,
                required: true,
                lowercase: true
            },
            street: {
                type: String,
                required: true,
                lowercase: true
            },
            number: {
                type: String,
                required: true,
            },
            zip: {
                type: String,
                required: false,
                lowercase: true
            }
        },
        fullAdress: {
            type: String,
            required: false,
        },
        location:{
            type: {
                type: String,
                enum: ['Point'],
                required: false,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: false,
                default: [-23.5504,-46.6339]
            }
        },
        contact: {
            phonenumber: {
                type: String,
                trim: true,
                default: '684479954'
            },
            email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [EMAIL_PATTERN, 'invalid email'],
            unique: false,
            default: 'maisgoson@gmail.com'
            }
        },
        description:{
            type: String,
            required: false,
            default: faker.lorem.paragraph()
        },
        priceAverage:{
            type: String,
            required: false,
            default: '15,00€'
        },
        capacity:{
            type: Number,
            required: false,
            default: 40
        },
        timeTable:{
            days: {
                type: [String],
                required: true
            },
            openhour: {
                type: String,
                required: false,
                default: '12:00'
            },
            closehour: {
                type: String,
                required: false,
                default: '24:00'
            }
        },
        cuisine:{
            type: String,
            required: false,  
            default: 'generic food',
            lowercase: true
        },

        image: {
            type: [String],
            default: 'https://res.cloudinary.com/eatookapp/image/upload/v1614196064/defaultrestaurant_uc4ar8.png'
        },
        owner: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        }
    }
)

restaurantSchema.index({location: '2dsphere'})

restaurantSchema.virtual("likes", {
    ref: "Like",
    localField: "_id",
    foreignField: "restaurant",
});

restaurantSchema.virtual("bookings", {
    ref: "Booking",
    localField: "_id",
    foreignField: "restaurant",
});

restaurantSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "restaurant",
});

restaurantSchema.pre('save', function(next) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.adress.city}+${this.adress.street}+${this.adress.number}&key=${process.env.API_KEY_MAPS}`)
    .then((response) =>  {
      this.location.coordinates[0] = response.data.results[0].geometry.location.lat
      this.location.coordinates[1] = response.data.results[0].geometry.location.lng
      this.fullAdress = response.data.results[0].formatted_address
      next()
    })
    .catch(e => next(e))
})
  
const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;
