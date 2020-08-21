const express = require('express');
const ItemInfo = require('./itemInfos.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const itemInfoss = await ItemInfo.query().finder.deletedAt(false)
            .withGraphFetched('[user, retailer, item, location]');
            
        res.json(itemInfoss);
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
        const newItemInfo= await ItemInfo.query().insert(req.body);
        res.json(newItemInfo);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', middlewares.authenticateJWT, async (req, res, next) => {
    const { role } = req.user;
    const {id} = req.params;

    if (role !== 'admin') {
        const error = new Error('Only admins are allowed.');
        res.status(403);
        next(error);
    }

    try {
        const itemInfo = await ItemInfo.query().finder.id(id).first()
        .withGraphFetched('[user, retailer, item, location]');
        res.json(item);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', middlewares.authenticateJWT, async (req, res, next) => {
    const { role } = req.user;
    const {id} = req.params;

    if (role !== 'admin') {
        const error = new Error('Only admins are allowed.');
        res.status(403);
        next(error);
    }

    try {
        await ItemInfo.query().findById(id).delete();
        res.json("Item info deleted.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;