const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Set port
var PORT = process.env.PORT || 3000;

// Init app
const app = express();

// View Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// methodOverride
app.use(methodOverride('_method'));

// home page
app.get('/', function(req, res, next) {
    res.render('searchcourses');
});

// Add Course Page
app.get('/course/add', function(req, res, next) {
    res.render('addcourse');
});

app.listen(PORT, function(error) {
    if(error) throw error;
    console.log(`Server started successfully on port ${PORT}`);
});