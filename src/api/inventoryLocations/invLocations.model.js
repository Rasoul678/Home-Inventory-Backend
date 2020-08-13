const tableNames = require('../../constants/tableNames');
const schema = require('./invLocations.schema.json');
const BaseModel = require('../../BaseModel');

class InventoryLocation extends BaseModel {
    static get tableName() {
      return tableNames.inventory_location;
    }

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = InventoryLocation;