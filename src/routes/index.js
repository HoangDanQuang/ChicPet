const homeRouter = require('./home');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const authRouter = require('./auth');
const accountRouter = require('./account');
const serviceRouter = require('./service');
const contactRouter = require('./contact');
const bookRouter = require('./book');
const blogRouter = require('./blog');
const { requireAuth, checkUser } = require('../app/middleware/AuthMiddleware');


function route(app) {
    app.get('*', checkUser);
    app.get('/', (req, res) => {
        res.render('home');
    })
    app.use('/home', homeRouter);
    app.use('/account', accountRouter);
    app.use('/service', serviceRouter);
    app.use('/contact', contactRouter);
    app.use('/blog', blogRouter);
    app.use('/', authRouter);
}

module.exports = route;