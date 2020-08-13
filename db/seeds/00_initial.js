const Knex = require("knex");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const countries = require('../../src/constants/countries');
const orderedTableNames = require('../../src/constants/orderedTableNames');
const tableNames = require('../../src/constants/tableNames');

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  await orderedTableNames.reduce(async(promise, table_name)=>{
    await promise;
    console.log(`Clearing ${table_name}`);
    return knex(table_name).del();
  }, Promise.resolve())

const password = crypto.randomBytes(15).toString('hex');

  const user = {
    name: 'Rasoul',
    email: 'rasoul@gmail.com',
    password: await bcrypt.hash(password, 12),
    role: 'admin'
  };

  const [createdUser] = await knex(tableNames.user).insert(user).returning('*');

  if(process.env.NODE_ENV !== 'test'){
    console.log(`Password: ${password}`);
    console.log(createdUser);
  }

  const states = [
    {name: 'Colorado', code: 'CO', 'country_id': 1},
    {name: 'Arizona', code: 'AZ', 'country_id': 1},
    {name: 'Texas', code: 'TX', 'country_id': 1},
  ];

  const shapes = [
    {name: 'triangle', description: 'triangle'},
    {name: 'square', description: 'square'},
    {name: 'pentagon', description: 'pentagon'},
    {name: 'circle', description: 'circle'},
    {name: 'oval', description: 'oval'},
    {name: 'cube', description: 'cube'},
    {name: 'cylinder', description: 'cylinder'},
  ]

  await knex(tableNames.country).insert(countries);

  await knex(tableNames.state).insert(states);

  await knex(tableNames.shape).insert(shapes);

};
