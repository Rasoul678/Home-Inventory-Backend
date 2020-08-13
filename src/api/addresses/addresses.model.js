const tableNames = require('../../constants/tableNames');
const schema = require('./addresses.schema.json');
const BaseModel = require('../../BaseModel');

class Address extends BaseModel {
    static get tableName() {
      return tableNames.address;
    }

    static get relationMappings() {
      const State = require('../states/states.model');
      const Company = require('../companies/companies.model');

      return {
        state: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: State,
          join: {
            from: 'address.state_id',
            to: 'state.id'
          }
        },
        companies: {
          relation: BaseModel.HasManyRelation,
          modelClass: Company,
          join: {
            from: 'address.id',
            to: 'company.address_id'
          }
        }
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Address;