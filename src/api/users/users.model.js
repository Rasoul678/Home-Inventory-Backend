const tableNames = require('../../constants/tableNames');
const schema = require('./users.schema.json');
const BaseModel = require('../../BaseModel');
const bcrypt = require('bcrypt');

class User extends BaseModel {
    static get tableName() {
      return tableNames.user;
    }

    static get hidden () {
      return ['password']
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.password = await bcrypt.hash(this.password, 12);
  }

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = User;