const tableNames = require('../../constants/tableNames');
const schema = require('./itemImages.schema.json');
const BaseModel = require('../../BaseModel');

class ItemImage extends BaseModel {
    static get tableName() {
      return tableNames.item_image;
    }

    static get relationMappings() {
      const Item = require('../items/items.model');

      return {
        item: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: Item,
          join: {
            from: 'item_image.item_id',
            to: 'item.id'
          }
        }
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = ItemImage;