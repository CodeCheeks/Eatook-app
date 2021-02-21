const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        adress:{
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            zip: {
                type: String,
                required: true
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
            default: 'Generic Food'
        }
    }
)

const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;