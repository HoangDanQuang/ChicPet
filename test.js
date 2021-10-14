const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const port = 3000;
const app = express();
//Template engine
app.engine('handlebars', handlebars());
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
app.engine('.hbs', handlebars({
    extname: '.hbs'
}));

//route
app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})