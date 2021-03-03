const hbs = require("hbs");
const path = require('path')

hbs.registerPartials(path.join(__dirname, "../views/partials"));



// Comprobar si es user
hbs.registerHelper('isOwner', function (role, options) {
    return role === 'owner' ? options.fn() : options.inverse()
})


// Comprobar si es user
hbs.registerHelper('checkDay', function (data, day, options) {
    return data.includes(day) ? options.fn() : options.inverse()
})




