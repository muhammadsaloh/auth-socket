const { sequelize, DataTypes } = require('../modules/postgres');

async function UserModel () {
    let user = sequelize.define('User', {
        chat_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        step: {
            type: DataTypes.SMALLINT,
            defaultValue: 1
        },
        phone: {
            type: DataTypes.BIGINT
        },
        sessions: {
            type: DataTypes.STRING
        },
        age: {
            type: DataTypes.SMALLINT
        },
        name: {
            type: DataTypes.STRING
        },
        code: {
            type: DataTypes.BIGINT
        }
    });

    await sequelize.sync(
        // { force: true } 
    )
    return user
};

async function findUser (chatId) {
    let model = await UserModel()
    return model.findOne({ chat_id: chatId })
};

async function findPhone () {
    let model = await UserModel()
    return model.findAll()
}

async function userCreate (chatId) {
    let model = await UserModel()
    return await model.create(chatId)
};

async function userUpdate (chatId, step, phone, sessions, age, name) {
    let model = await UserModel()
    return await model.update(chatId, step, phone, sessions, age, name)
};

module.exports = { findUser, userCreate, userUpdate, findPhone };