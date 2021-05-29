const { Sequelize, DataTypes, Op } = require('sequelize');
const PGURL = "postgres://postgres:1111@localhost:5432/sockets";

const sequelize = new Sequelize( PGURL, {
    logging: false
});

module.exports = {sequelize, DataTypes, Op}