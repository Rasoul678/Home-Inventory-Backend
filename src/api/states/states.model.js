const tableNames = require('../../constants/tableNames');
const schema = require('./states.schema.json');
const BaseModel = require('../../BaseModel');

class State extends BaseModel {
    static get tableName() {
      return tableNames.state;
    }

    static get relationMappings() {
      const Address = require('../addresses/addresses.model');
      const Country = require('../countries/countries.model');
      return {
        addresses: {
          relation: BaseModel.HasManyRelation,
          modelClass: Address,
          join: {
            from: 'state.id',
            to: 'address.state_id'
          }
        },
        country: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: Country,
          join: {
            from: 'state.country_id',
            to: 'country.id'
          }
        }
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = State;