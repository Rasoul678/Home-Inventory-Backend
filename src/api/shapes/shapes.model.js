const tableNames = require('../../constants/tableNames');
const schema = require('./shapes.schema.json');
const BaseModel = require('../../BaseModel');

class Shape extends BaseModel {
    static get tableName() {
      return tableNames.shape;
    }

    static get relationMappings() {
      const Size = require('../sizes/sizes.model');
  
      return {
        sizes: {
          relation: BaseModel.HasManyRelation,
          modelClass: Size,
          join: {
            from: 'shape.id',
            to: 'size.shape_id'
          }
        }
      }
  }

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Shape;