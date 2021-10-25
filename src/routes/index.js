const homeRouter = require('./home');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const accountRouter = require('./account');


function route(app) {
    app.get('/', (req, res) => {
        res.render('home');
    })
    app.use('/home', homeRouter);
    app.use('/login', loginRouter);
    app.use('/signup', signupRouter);
    app.use('/account', accountRouter);
}

module.exports = route;