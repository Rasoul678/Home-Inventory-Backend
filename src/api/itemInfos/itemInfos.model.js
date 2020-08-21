const tableNames = require('../../constants/tableNames');
const schema = require('./itemInfos.schema.json');
const BaseModel = require('../../BaseModel');

class ItemInfo extends BaseModel {
    static get tableName() {
      return tableNames.item_info;
    }

    static get relationMappings() {
      const User = require('../users/users.model');
      const Item = require('../items/items.model');
      const Company = require('../companies/companies.model');
      const InventoryLocation = require('../inventoryLocations/invLocations.model');

      return {
        user: {
          relation: BaseModel.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'item_info.user_id',
            to: 'user.id'
          }
        },

        item: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Item,
            join: {
              from: 'item_info.item_id',
              to: 'item.id'
            }
          },

          retailer: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Company,
            join: {
              from: 'item_info.retailer_id',
              to: 'company.id'
            }
          },

          location: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: InventoryLocation,
            join: {
              from: 'item_info.inventory_location_id',
              to: 'inventory_location.id'
            }
          },
      }
    };

    static get jsonSchema() {
      return schema;
    }
  }

  module.exports = ItemInfo;