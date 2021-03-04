const mongoose = require("mongoose");
const User = require("./User.model");

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

const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;