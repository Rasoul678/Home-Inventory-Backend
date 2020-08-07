const db = require('../../db');
const tableNames = require('../../constants/tableNames');

const fields = ['id', 'name', 'code', 'country_id'];

module.exports = {
    find(){
        // TODO: Filter by country.
        // TODO: Join to country table.
        return db(tableNames.state).select(fields);
    },

    get(id){
        return db(tableNames.state).select(fields).where({id}).first();
    }
};