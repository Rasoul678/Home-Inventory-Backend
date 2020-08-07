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
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable();
      email(table, 'email').notNullable().unique();
      table.string("password", 127).notNullable();
      table.dateTime("last_login");
      addDefaultColumns(table);
    }),

    knex.schema.createTable(tableNames.inventory_location, (table) => {
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
    references(table, tableNames.state, false);
    table.string("street_address_1", 50).notNullable();
    table.string("street_address_2", 50);
    table.string("city", 50).notNullable();
    table.string("zipcode", 15).notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
    addDefaultColumns(table);
  });

  await knex.schema.createTable(tableNames.company, (table) => {
    table.increments().notNullable();
    references(table, tableNames.address);
    table.string("name").notNullable();
    table.string("description", 1000);
    table.string('type').notNullable();
    email(table, 'email');
    url(table, 'logo_url');
    url(table, 'website_url');
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
    await Promise.all([
        tableNames.company,
        tableNames.address,
        tableNames.user,
        tableNames.item_type,
        tableNames.state,
        tableNames.country,
        tableNames.shape,
        tableNames.inventory_location
    ].map((tableName)=>knex.schema.dropTableIfExists(tableName)));
};
