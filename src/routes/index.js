const homeRouter = require('./home');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const accountRouter = require('./account');
const serviceRouter = require('./service');


function route(app) {
    app.get('/', (req, res) => {
        res.render('home');
    })
    app.use('/home', homeRouter);
    app.use('/login', loginRouter);
    app.use('/signup', signupRouter);
    app.use('/account', accountRouter);
    app.use('/service', serviceRouter);
}

module.exports = route;