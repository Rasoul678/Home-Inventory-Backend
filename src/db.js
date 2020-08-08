const knex = require('knex');
const knexConfig = require('../knexfile');
const { Model } = require('objection');

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];
const connection = knex(connectionConfig);

Model.knex(connection);

module.exports = connection;