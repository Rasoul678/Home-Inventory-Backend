const express = require('express');
const Size = require('./sizes.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const sizes = await Size.query().finder.deletedAt(false).withGraphFetched('shape');
        res.json(sizes);
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

        const newSize = await Size.query().insert(req.body);
        res.json(newSize);
    } catch (error) {
        next(error);
    }
});

module.exports = router;