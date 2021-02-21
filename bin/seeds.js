require("../config/db.config");
const faker = require('faker');

const Celebrity = require("../models/Restaurant.model");

const mongoose = require('mongoose');
const Restaurant = require("../models/Restaurant.model");

const restaurants = []

for(let i=0; i<20; i++){
    restaurants.push({
        name: faker.company.companyName(),
        adress: {
            street: faker.address.streetName(),
            city: faker.address.city(),
            country: faker.address.country(),
            zip: faker.address.zipCode()
        },
        timeTable: {
            days: faker.date.weekday(),
        }
    })
}


Restaurant.deleteMany()
.then( () => 
    Restaurant.create(restaurants)
    .then(restaurants => restaurants.forEach(restaurant => console.log(`New restaurant added: ${restaurant.name}`)))
        .then(() => {
            console.log('Mongoose conection close')
            mongoose.connection.close()
        })
        .catch(error => console.log(error))
    .catch(error => console.log(error))
)
.catch(console.log('An error happened while saving a new restaurant'))
