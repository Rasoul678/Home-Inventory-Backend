const { Model } = require('objection');
const Finder = require('objection-dynamic-finder');
const softDelete = require('objection-soft-delete');
const visibilityPlugin = require('objection-visibility').default;

require('./db');

class BaseModel extends softDelete({ columnName: 'deleted_at' })(Finder(visibilityPlugin(Model))) {}

module.exports = BaseModel;