const homeRouter = require('./home')


function route(app) {
    app.get('/', (req, res) => {
        res.render('home');
    })
    app.use('/home', homeRouter);
}

module.exports = route;