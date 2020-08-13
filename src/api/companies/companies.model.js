const tableNames = require('../../constants/tableNames');
const schema = require('./companies.schema.json');
const BaseModel = require('../../BaseModel');

class Company extends BaseModel {
    static get tableName() {
      return tableNames.company;
    }

    static get relationMappings() {
      const Address = require('../addresses/addresses.model');
      return {
        address: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: Address,
          join: {
            from: 'company.address_id',
            to: 'address.id'
          }
        }
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Company;