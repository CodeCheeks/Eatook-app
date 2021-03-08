require("../config/db.config");
const faker = require('faker');

const mongoose = require('mongoose');
const Restaurant = require("../models/Restaurant.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");


Promise.all(Review.deleteMany().then(() => {
  for(let i=0; i<10; i++){
    Restaurant.find()
    .then((restaurants) => {
      User.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phonenumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        image: faker.image.image(),
        password: 'Example123',
        role: 'user',
        active: true
      })
      .then((u) =>{
        restaurants.forEach((rest) => {
          Review.create({
            user: u._id,
            restaurant: rest._id,
            comment: faker.lorem.paragraph(),
            rating: Math.floor(Math.random()*6)
          })
          .then((review) =>{
            console.log(`New review added: ${review.id}`)
          })
      })
    })
    })

  }
}))
