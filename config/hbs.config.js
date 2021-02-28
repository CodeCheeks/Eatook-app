const hbs = require("hbs");
const path = require('path')

hbs.registerPartials(path.join(__dirname, "../views/partials"));


hbs.registerHelper('myrole', function (user) {

    if(user === 'owner'){
        return '<li class="nav-item"><a class="nav-link active mx-4 px-4" aria-current="page" href="/add-restaurant">Add restaurant</a></li>'
    }
})

