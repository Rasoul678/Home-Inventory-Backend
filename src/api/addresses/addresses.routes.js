const express = require('express');
const Address = require('./addresses.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const addresses = await Address.query().finder.deletedAt(false).withGraphFetched('state');
        res.json(addresses);
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
        ['street_address_1','street_address_2','city','zipcode'].forEach((prop) => {
            if(req.body[prop]){
                req.body[prop] = req.body[prop].toString().toLowerCase().trim();
            }
        });
        const newAddress = await Address.query().insert(req.body);
        res.json(newAddress);
    } catch (error) {
        next(error);
    }
});

module.exports = router;