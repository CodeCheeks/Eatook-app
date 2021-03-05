const hbs = require("hbs");
const path = require('path')

const Restaurant = require("../models/Restaurant.model")

hbs.registerPartials(path.join(__dirname, "../views/partials"));




hbs.registerHelper('isOwner', function (role, options) {
    return role === 'owner' ? options.fn() : options.inverse()
})

hbs.registerHelper('checkDay', function (data, day, options) {
    if(data === undefined){
        return options.inverse()
    }
    return data.includes(day) ? options.fn() : options.inverse()
})

// Comprobar si es user
hbs.registerHelper('checkHour', function (data, hour, options) {
    if(data === undefined){
        return options.inverse()
    }
    return data.includes(hour) ? options.fn() : options.inverse()
})


hbs.registerHelper('random', function () {
    return Math.floor(Math.random() * (40 - 0) + 0)
})