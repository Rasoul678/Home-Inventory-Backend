const express = require('express');
const InventoryLocation = require('./invLocations.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const inventoryLocations = await InventoryLocation.query().finder.deletedAt(false);
        res.json(inventoryLocations);
    } catch (error) {
        next(error);
    }
});

router.post('/', middlewares.authenticateJWT, async (req, res, next) => {
    const { role } = req.user;

    if (role !== 'admin') {
        const error = new Error('Only admins are allowed.');
        res.status(403);
        next(error);
    }

    try {
        ['name','description','image_url'].forEach((prop) => {
            if(req.body[prop]){
                req.body[prop] = req.body[prop].toString().toLowerCase().trim();
            }
        });

        const newInvLocation = await InventoryLocation.query().insert(req.body);
        res.json(newInvLocation);
    } catch (error) {
        next(error);
    }
});

module.exports = router;