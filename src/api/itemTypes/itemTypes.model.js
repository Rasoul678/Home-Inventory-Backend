const tableNames = require('../../constants/tableNames');
const schema = require('./itemTypes.schema.json');
const BaseModel = require('../../BaseModel');

class ItemType extends BaseModel {
    static get tableName() {
      return tableNames.item_type;
    }

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = ItemType;