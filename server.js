const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Redis = require("ioredis");

// Create redis client
const redisClient = new Redis({
    host: '127.0.0.1',
    port: 9001,
});
redisClient.on('connect', () => {
    console.log('Redis Connection Successful...');
  });
redisClient.on('error', () => {
    const msg = 'Redis Error: no connection';
    console.error(msg);
});

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

// search processing
app.post('/course/search', async function(req, res, next) {
    const id = req.body.id;
    const obj = await redisClient.hgetall(id);
    console.log(obj);
    if(!obj.name) {
        res.render('searchcourses', {
            error: 'Course does not exist'
        });
    } else {
        obj.id = id;
        res.render('details', {
            course: obj
        });
    }
});

// Add Course Page
app.get('/course/add', function(req, res, next) {
    res.render('addcourse');
});

// Process Add Course Page
app.post('/course/add', async function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let instructor = req.body.instructor;
    let startdate = req.body.startdate;
    let period = req.body.period;

    try{
        await redisClient.hmset(id, [
            'name', name,
            'instructor', instructor,
            'startdate', startdate,
            'period', period
        ]);
        res.redirect('/');
    } catch (error) {
        console.log(`Something went wrong while getting data from Redis: ${error}`);
    }
});

// Delete Course
app.delete('/course/delete/:id', async function(req, res, next) {
    try{
        await redisClient.del(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.log(`Something went wrong while deleting data: ${error}`);
    }
});

app.listen(PORT, function(error) {
    if(error) throw error;
    console.log(`Server started successfully on port ${PORT}`);
});