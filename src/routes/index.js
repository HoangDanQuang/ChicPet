const homeRouter = require('./home')
const loginRouter = require('./login')
const signupRouter = require('./signup')


function route(app) {
    app.get('/', (req, res) => {
        res.render('home');
    })
    app.use('/home', homeRouter);
    app.use('/login', loginRouter);
    app.use('/signup', signupRouter);
}

module.exports = route;