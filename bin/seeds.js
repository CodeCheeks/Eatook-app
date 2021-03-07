require("../config/db.config");
const faker = require('faker');

const mongoose = require('mongoose');
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");

const {images, cuisine, openhour, closehour, prices, days} = require("./imageData")

Promise.all([Restaurant.deleteMany(), User.deleteMany()]).then(() => {
  
  for(let i = 0; i<40; i++){
      User.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phonenumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        password: 'Example123',
        role: 'owner',
        active: true
      })
      .then((u) => {
          Restaurant.create({
            name: faker.company.companyName(),
            adress: {
                street: faker.address.streetAddress(),
                city: faker.address.city(),
                country: faker.address.country(),
                zip: faker.address.zipCode(),
            },
            contact: {
              phonenumber: faker.phone.phoneNumberFormat(),
              email: faker.internet.email()
            },
            description: faker.lorem.paragraphs(),
            priceAverage: prices[Math.floor(Math.random() * prices.length)],
            image: [images[Math.floor(Math.random() * images.length)], images[Math.floor(Math.random() * images.length)], images[Math.floor(Math.random() * images.length)], images[Math.floor(Math.random() * images.length)]],
            cuisine: cuisine[Math.floor(Math.random() * cuisine.length)],
            timeTable: {
              days: days[Math.floor(Math.random() * days.length)],
              openhour: openhour[Math.floor(Math.random() * openhour.length)],
              closehour: closehour[Math.floor(Math.random() * closehour.length)]
            },
            owner: u._id
            
          })
          .then((restaurant) => {
            u.restaurants.push(restaurant._id)
            User.findByIdAndUpdate(u._id,{restaurants: u.restaurants})
            .then(() => {
              console.log(`Created ${restaurant.name} by ${u.email}`)
            })
        })
      .catch((e) => console.log(e));
      })
    }
  });
  
 