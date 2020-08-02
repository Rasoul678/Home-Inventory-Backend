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

    await knex.schema.table(tableNames.address, (table)=>{
        table.dropColumn('country_id');
    });

    await knex.schema.table(tableNames.state, (table)=>{
        table.string('code');
        references(table, tableNames.country);
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
};

exports.down = async (knex) => {
    await knex.schema.table(tableNames.address, (table)=>{
        references(table, tableNames.country);
    });
    await knex.schema.table(tableNames.state, (table)=>{
        table.dropColumn('country_id');
    });
    await knex.schema.dropTable(tableNames.size);
};
