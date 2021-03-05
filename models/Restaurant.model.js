const mongoose = require("mongoose");
const User = require("./User.model");
const faker = require('faker');

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
                required: true,
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
            zip: {
                type: String,
                required: true,
                lowercase: true
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
            default: faker.commerce.price()
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

const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;