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
                required: true
            }
        },
        cuisine:{
            type: String,
            required: true  
        }
    }
)

const Restaurant = mongoose.model('Restaurant',restaurantSchema)

module.exports = Restaurant;