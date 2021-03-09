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

hbs.registerHelper('average', function (rateArr) {
    let rates = [];
    rateArr.forEach(element => rates.push(element.rating))
    return (rates.reduce((a, b) => (a + b)) / rates.length).toFixed(1)
})

hbs.registerHelper('randomRestaurant', function (info, key, n) {
let item = info[n];
if(key === "name"){
    return item.name
}
else if(key === "image"){
    return item.image[0]
}
else if(key === "cuisine"){
    return item.cuisine
}
else if (key === "id"){
    return item.id
    }
})

hbs.registerHelper('reverse', function (arr) {
    arr.reverse();
});

hbs.registerHelper('limit', function (i, options) {
    return i < 4 ? options.fn() : options.inverse()
})

hbs.registerHelper('limit2', function (i, options) {
    return i >= 4 ? options.fn() : options.inverse()
})