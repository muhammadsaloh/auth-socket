const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', {

    });
});


module.exports = {
    path: '/home',
    router
}