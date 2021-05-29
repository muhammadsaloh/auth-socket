const TelegramBot = require('node-telegram-bot-api');
const { userCreate, findUser, userUpdate } = require('./models/UserModel')
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();


// PORT
const PORT = process.env.PORT;


// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SETTINGS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ROUTES
const RoutesPath = path.join(__dirname, "routes");
fs.readdir(RoutesPath, (err, files) => {
    if(err) throw new Error(err)
    files.forEach(route => {
        const RoutePath = path.join(__dirname, "routes", route);
        const Route = require(RoutePath)
        if(Route.path && Route.router) app.use(Route.path, Route.router)
    })
})

app.get('/', (_, res) => res.redirect('/home'));

// LISTEN
app.listen(PORT, () => console.log(`Server running ${PORT}...`));


// BOT
const TOKEN = '1849512948:AAHNyCNu6qRviJYkndBJai9Ksswm2bjuFeU';
const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.on('message', async (message) => {
    const chatId = message.chat.id
    const userName = message.chat.first_name
    const message_id = message.message_id
    const text = message.text
    let one
    let i
    let user = await findUser()
    for(i of user){
        one = i.chat_id == chatId
    }
    // console.log(i);
    if(!one) {
        await userCreate({ chat_id: chatId });
        bot.sendMessage(chatId, `Assalomu alaukum <b>${userName}</b>! Socket.io saytiga registratsiya qilishni boshlaymiz!`, {
            parse_mode: "HTML"
        })

        setTimeout( () => {
            bot.sendMessage(chatId, `Ro'yxatga olindingiz, telefon raqamingizni yuboring!\nMasalan +998xx xxx xx xx`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [
                            {
                                text: "📞 Raqam yuborish",
                                request_contact: true
                            }
                        ]
                    ]
                }
            })
        }, 2000 )
    } 
    else if (i.dataValues?.step == 1 && (message.contact?.phone_number || text)) {
        try {
            await userUpdate({
                step: 2,
                phone: message.contact.phone_number || Number(text),
                name: userName
            }, {
                where: {
                    chat_id: chatId
                }
            })
            await bot.sendMessage(chatId, `${userName}, endi yoshingizni kiriting?`)
        } catch (e) {
            bot.sendMessage(chatId, `Qandaydir xato qildingiz, raqamda kiriting`)
        }
    }
    else if (i.dataValues?.step == 2 && text) {
        try {
            await userUpdate({
                step: 3,
                age: Number(text)
            }, {
                where: {
                    chat_id: chatId
                }
            })
            bot.sendMessage(chatId, `Shu saytga kirishingiz mumkin endi <a href='https://google.com/'>Home</a>\n\nhttp://localhost:2313/home`, {
                parse_mode: "HTML"
            })
        } catch (e) {
            bot.sendMessage(chatId, `Qandaydir xato qildingiz, yoshni raqamda kirgizing va to'g'ri bo'lsin!`)
        }
    }
    else if (i.dataValues?.step == 4) {
        try {
            bot.sendMessage(chatId, `Code 2 minut ichida keladi, olmagan bo'lsangiz pastdagi tugmani bosing, yoki shu nomerdan telefon bo'ladi 998901174219\n\n<a href='https://www.google.com/'>Kirish</a>\n\nhttp://localhost:2313/kirish`, {
                parse_mode: "HTML",
                reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [
                                {
                                    text: "Codeni olish"
                                }
                            ]
                        ]
                    }
                })
            await userUpdate({
                step: 5
            }, {
                where: {
                    chat_id: chatId
                }
            })
        } catch (e) {
            bot.sendMessage(chatId, `${e + ""}`)
        }
    } 
    else if (text == 'Codeni olish' && i.dataValues?.step == 5) {
        var val = Math.floor(10000 + Math.random() * 90000);
        bot.sendMessage(chatId, val)
        await userUpdate({
            step: 6,
            code: val
        }, {
            where: {
                chat_id: chatId
            }
        })
    }
    else {
        bot.sendMessage(chatId, `Logindan o'tish uchun shu saytga kiring <b>http://localhost:2313/home</b> \nQayta ro'yxatdan o'tish uchun, 2.0.0 versiyani kuting`, {
            parse_mode: "HTML"
        })
    }
    
});
