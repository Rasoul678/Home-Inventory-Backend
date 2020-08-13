const express = require('express');
const ItemType = require('./itemTypes.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const itemTypes = await ItemType.query().finder.deletedAt(false);
        res.json(itemTypes);
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

        req.body.name = req.body.name.toString().toLowerCase().trim();

        const newItemType = await ItemType.query().insert(req.body);
        res.json(newItemType);
    } catch (error) {
        next(error);
    }
});

module.exports = router;