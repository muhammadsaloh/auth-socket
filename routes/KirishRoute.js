const { findPhone, userUpdate } = require('../models/UserModel');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('kirish', {

    });
});

router.post('/', async (req, res) => {
    try {
        const { code } = req.body
        let user = await findPhone()
        let one
        for(i of user){
            one = code == i.dataValues.code
        }
        if(!one) {
            throw new Error(`Siz mavjud bo'lmagan, codeni kiritdingiz!`)
        } else {
            res.redirect('/users')
        }
    } catch (e) {
        res.render('kirish', {
            title: "Kirish",
            error: e + ""
        })
    }
})


module.exports = {
    path: '/kirish',
    router
}