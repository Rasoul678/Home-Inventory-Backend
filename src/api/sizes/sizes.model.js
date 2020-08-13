const tableNames = require('../../constants/tableNames');
const schema = require('./sizes.schema.json');
const BaseModel = require('../../BaseModel');

class Size extends BaseModel {
    static get tableName() {
      return tableNames.size;
    }

    static get relationMappings() {
        const Shape = require('../shapes/shapes.model');
    
        return {
          shape: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Shape,
            join: {
              from: 'size.shape_id',
              to: 'shape.id'
            }
          }
        }
    }

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Size;