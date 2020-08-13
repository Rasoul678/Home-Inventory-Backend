const express = require('express');
const project = require('../constants/project');
const states = require('./states/states.routes');
const countries = require('./countries/countries.routes');
const users = require('./users/users.routes');
const auth = require('./auth/auth.routes');
const addresses = require('./addresses/addresses.routes');
const companies = require('./companies/companies.routes');
const shapes = require('./shapes/shapes.routes');
const sizes = require('./sizes/sizes.routes');
const itemTypes = require('./itemTypes/itemTypes.routes');
const inventoryLocations = require('./inventoryLocations/invLocations.routes');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: project.message
    });
})

router.use('/auth', auth);
router.use('/states', states);
router.use('/countries', countries);
router.use('/users', users);
router.use('/addresses', addresses);
router.use('/companies', companies);
router.use('/shapes', shapes);
router.use('/sizes', sizes);
router.use('/item_types', itemTypes);
router.use('/inventory_locations', inventoryLocations);

module.exports = router;