function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.boolean("deleted_at").notNullable().defaultTo(false);
  }
  
  function createNameTable(knex, table_name) {
    return knex.schema.createTable(table_name, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable().unique();
      addDefaultColumns(table);
    });
  }
  
  function references(table, tableName, notNullable = true, columnName = ''){
      const definition = table.integer(`${columnName || tableName}_id`)
        .unsigned()
        .references('id')
        .inTable(tableName)
        .onDelete('cascade');

        if(notNullable){
          definition.notNullable();
        }

        return definition;
  }
  
  function url(table, columnName){
      table.string(columnName, 2000);
  }
  
  function email(table, columnName){
      return table.string(columnName, 254);
  }


  module.exports = {
      addDefaultColumns,
      createNameTable,
      references,
      url,
      email
  }