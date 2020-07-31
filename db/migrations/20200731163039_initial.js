const Knex = require("knex");
const tableNames = require("../../src/constants/tableNames");

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime("deleted_at");
}

function createNameTable(knex, table_name) {
  return knex.schema.createTable(table_name, (table) => {
    table.increments().notNullable();
    table.string("name").notNullable().unique();
    addDefaultColumns(table);
  });
}

function references(table, tableName){
    table
    .integer(`${tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade');
}

function url(table, columnName){
    table.string(columnName, 2000);
}

function email(table, columnName){
    return table.string(columnName, 254);
}

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable();
      email(table, 'email').notNullable().unique();
      table.string("password", 127).notNullable();
      table.dateTime("last_login");
      addDefaultColumns(table);
    }),

    knex.schema.createTable(tableNames.location, (table) => {
        table.increments().notNullable();
        table.string("name").notNullable().unique();
        table.string("description", 1000);
        url(table, 'image_url');
        addDefaultColumns(table);
      }),

    createNameTable(knex, tableNames.item_type),

    createNameTable(knex, tableNames.state),

    createNameTable(knex, tableNames.country),

    createNameTable(knex, tableNames.shape),
  ]);

  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    references(table, 'state');
    references(table, 'country');
    table.string("street_address_1", 50).notNullable();
    table.string("street_address_2", 50);
    table.string("city", 50).notNullable();
    table.string("zipcode", 15).notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.manufacturer, (table) => {
    table.increments().notNullable();
    references(table, 'address');
    table.string("name").notNullable();
    table.string("description", 1000);
    email(table, 'email');
    url(table, 'logo_url');
    url(table, 'website_url');
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
    await Promise.all([
        tableNames.manufacturer,
        tableNames.address,
        tableNames.user,
        tableNames.item_type,
        tableNames.state,
        tableNames.country,
        tableNames.shape,
        tableNames.location
    ].map((tableName)=>knex.schema.dropTable(tableName)));
};
