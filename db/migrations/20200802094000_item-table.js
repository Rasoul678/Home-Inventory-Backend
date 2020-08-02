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
        references(table, tableNames.manufacturer);
        references(table, tableNames.size);
        references(table, tableNames.item_type);
        table.string('name').unique().notNullable();
        table.text('description');
        table.string('sku', 100);
        table.boolean('sparks_joy').defaultTo(true);
        addDefaultColumns(table);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable(tableNames.size);
    await knex.schema.dropTable(tableNames.item);
};
