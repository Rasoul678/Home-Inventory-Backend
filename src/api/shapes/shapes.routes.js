const express = require('express');
const Shape = require('./shapes.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const shapes = await Shape.query().finder.deletedAt(false).withGraphFetched('sizes');
        res.json(shapes);
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
        ['name','description'].forEach((prop) => {
            if(req.body[prop]){
                req.body[prop] = req.body[prop].toString().toLowerCase().trim();
            }
        });
        const newShape = await Shape.query().insert(req.body);
        res.json(newShape);
    } catch (error) {
        next(error);
    }
});

module.exports = router;