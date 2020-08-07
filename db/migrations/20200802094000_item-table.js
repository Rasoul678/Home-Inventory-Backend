const Knex = require("knex");
const tableNames = require("../../src/constants/tableNames");
const {
  addDefaultColumns,
  createNameTable,
  references,
  url,
  email
} = require("../../src/libs/tableUtils");

/**
 * @param {Knex} knex 
 */
exports.up = async (knex) => {
    await knex.schema.table(tableNames.state, (table)=>{
        references(table, tableNames.country);
        table.string('code');
    });

    await knex.schema.table(tableNames.country, (table)=>{
        table.string('code');
    });

    await knex.schema.createTable(tableNames.size, (table)=>{
        table.increments().notNullable();
        references(table, tableNames.shape);
        table.string('name').unique().notNullable();
        table.float('length');
        table.float('width');
        table.float('height');
        table.float('volume');
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.item, (table)=>{
        table.increments().notNullable();
        references(table, tableNames.user);
        references(table, tableNames.company);
        references(table, tableNames.size);
        references(table, tableNames.item_type);
        table.string('name').unique().notNullable();
        table.text('description');
        table.string('sku', 100);
        table.boolean('sparks_joy').defaultTo(true);
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.item_info, (table)=>{
        table.increments().notNullable();
        references(table, tableNames.user);
        references(table, tableNames.item);
        references(table, tableNames.company, false, 'retailer');
        references(table, tableNames.inventory_location);
        table.dateTime('purchase_date').notNullable();
        table.dateTime('expiration_date');
        table.float('purchase_price').notNullable().defaultTo(0.00);
        table.float('msrp').notNullable();
        table.dateTime('last_used');
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.item_image, (table)=>{
        table.increments().notNullable();
        references(table, tableNames.item);
        url(table, 'image_url');
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.related_item, (table)=>{
        table.increments().notNullable();
        references(table, tableNames.item);
        references(table, tableNames.item, true, 'related_item');
        addDefaultColumns(table);
    });
};

/**
 * @param {Knex} knex 
 */
exports.down = async (knex) => {

    await knex.schema.table(tableNames.state, (table)=>{
        table.dropForeign('country_id');
        table.dropColumn('code');
    });

    await knex.schema.table(tableNames.country, (table)=>{
        table.dropColumn('code');
    });

    await Promise.all([
            tableNames.related_item,
            tableNames.item_image,
            tableNames.item_info,
            tableNames.item,
            tableNames.size
        ].map((table)=>knex.schema.dropTableIfExists(table))
    );
};
