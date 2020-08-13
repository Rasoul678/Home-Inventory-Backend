const tableNames = require('../../constants/tableNames');
const schema = require('./countries.schema.json');
const BaseModel = require('../../BaseModel');

class Country extends BaseModel {
    static get tableName() {
      return tableNames.country;
    }

    static get relationMappings() {
      const State = require('../states/states.model');
      return {
        states: {
          relation: BaseModel.HasManyRelation,
          modelClass: State,
          join: {
            from: 'country.id',
            to: 'state.country_id'
          }
        }
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Country;