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
  
  function references(table, tableName, notNullable = true){
      const definition = table.integer(`${tableName}_id`)
        .unsigned()
        .references('id')
        .inTable(tableName)
        .onDelete('cascade');

        if(notNullable){
          definition.notNullable();
        }

        
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