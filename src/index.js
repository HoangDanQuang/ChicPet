const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const route = require('./routes');
const connectDB = require('./config/connectDb');
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000;

app.use(express.static('public'))
const cookieParser = require('cookie-parser')
const session = require('express-session');
const { ExpressHandlebars } = require('express-handlebars');

//middlewares
app.use(cookieParser('secret'))
app.use(session({cookie: {maxAge: null}}))

//flash message middleware
app.use((req, res, next)=>{
  res.locals.user = req.session.user;
  delete req.session.message;
  next();
})


// Connect mongoDb
connectDB();

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
// app.use(morgan('combine'));
// Template engine
app.engine('hbs', exphandlebars({
    extname: '.hbs',
    // handlebars: allowInsecurePrototypeAccess(exphandlebars)
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// register handlebars function
var hbs = exphandlebars.create({});
hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});
hbs.handlebars.registerHelper('toDateTimeString', function (datetime) {
    var datetimeString = datetime.toDateString() + ' ' + datetime.toTimeString().substring(0, 5);
    return datetimeString;
});

//route init
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
