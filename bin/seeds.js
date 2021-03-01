require("../config/db.config");
const faker = require('faker');

const mongoose = require('mongoose');
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");


Promise.all([Restaurant.deleteMany(), User.deleteMany()]).then(() => {
    // Create N users
    for (let i = 0; i < 2; i++) {
      User.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phonenumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        password: 'Example123',
        role: 'owner',
        active: true
      }).then((u) => {
        // For each user, create N products
        for (let j = 0; j < 3; j++) {
          Restaurant.create({
            name: faker.company.companyName(),
            adress: {
                street: faker.address.streetName(),
                city: faker.address.city(),
                country: faker.address.country(),
                zip: faker.address.zipCode(),
            },
            timeTable: {
                days: faker.date.weekday(),
            },
            owner: u._id
            
          }).then((restaurant) => {
            
            u.restaurants.push(restaurant._id)
            User.findByIdAndUpdate(u._id,{restaurants: u.restaurants})
            
            .then((user) => {
              console.log('User restaurants:', user)
              console.log('urestaurants', u.restaurants)
              console.log(`Created ${restaurant.name} by ${u.email}`)
            
            }
            )
            
            
        })
        .catch((e) => console.log(e));
        }
      });
    }
  });




