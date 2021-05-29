const { findPhone, userUpdate } = require('../models/UserModel');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('login', {

    });
});

router.post('/', async (req, res) => {
    try {
        const { tel } = req.body
        let user = await findPhone()
        let one
        for(i of user){
            one = tel == i.dataValues.phone
        }
        if(!one){
            throw new Error(`Siz ro'yxatdan o'tmagansiz`)
        } else {
            await userUpdate({
                step: 4
            }, {
                where: {
                    phone: tel
                }
            })
            throw new Error(`ushbu raqamdagi telegramga 5xonali code ketdi shuni yuboring`)
        }
        res.redirect('/kirish')
    } catch (e) {
        res.render('login', {
            title: "Login",
            error: e + ""
        })
    }
})


module.exports = {
    path: '/login',
    router
}