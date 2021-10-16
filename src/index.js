const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const port = 3000;
const app = express();
//Template engine
app.engine('handlebars', handlebars());
app.engine('.hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');



app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.static(path.join(__dirname, 'public')));
//HTTP logger
app.use(morgan('combined'))
    //set up middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());



//route
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/service', (req, res) => {
    res.render('service');
});



//route
app.get('/test', (req, res) => {
    res.render('test');
});
app.get('/search', (req, res) => {
    res.render('search');
});
app.post('/search', (req, res) => {
    res.send('data gửi từ form post');
    console.log(req.body.q);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})