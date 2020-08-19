const express = require('express');
const Item= require('./items.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const items = await Item.query().finder.deletedAt(false)
            .withGraphFetched('[user, company, item_type, item_images, size, size.shape, company.address]');
            
        res.json(items);
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
        ['name', 'description'].forEach((prop) => {
            if(req.body[prop]){
                req.body[prop] = req.body[prop].toString().toLowerCase().trim();
            }
        });
        const newItem= await Item.query().insert(req.body);
        res.json(newItem);
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
        const item = await Item.query().finder.id(id).first()
        .withGraphFetched(`[
            user, company, item_type, item_images, size, size.shape,
            company.[address, address.[state, state.country]]
        ]`);
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
        await Item.query().findById(id).delete();
        res.json("Item deleted.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;