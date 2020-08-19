const tableNames = require('../../constants/tableNames');
const schema = require('./items.schema.json');
const BaseModel = require('../../BaseModel');

class Item extends BaseModel {
    static get tableName() {
      return tableNames.item;
    }

    static get relationMappings() {
      const User = require('../users/users.model');
      const ItemType = require('../itemTypes/itemTypes.model');
      const Company = require('../companies/companies.model');
      const Size = require('../sizes/sizes.model');
      const ItemImage = require('../itemImages/itemImages.model');

      return {
        user: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'item.user_id',
            to: 'user.id'
          }
        },

        item_type: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: ItemType,
          join: {
            from: 'item.item_type_id',
            to: 'item_type.id'
          }
        },

        company: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Company,
            join: {
              from: 'item.company_id',
              to: 'company.id'
            }
          },

          size: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Size,
            join: {
              from: 'item.size_id',
              to: 'size.id'
            }
          },

          item_images: {
            relation: BaseModel.HasManyRelation,
            modelClass: ItemImage,
            join: {
              from: 'item.id',
              to: 'item_image.item_id'
            }
          },
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = Item;