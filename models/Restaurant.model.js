const mongoose = require("mongoose");
const UserModel = require("./User.model");

const restaurantSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true
        },
        adress:{
            street: {
                type: String,
                required: true,
                lowercase: true
            },
            city: {
                type: String,
                required: true,
                lowercase: true
            },
            country: {
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
            hours: {
                type: String,
                required: false,
                default: '13:00-17:00  20:00-24:00'
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
    }
)

const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;