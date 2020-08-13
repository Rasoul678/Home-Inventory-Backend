const express = require('express');
const Company = require('./companies.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/',middlewares.authenticateJWT, async (req, res, next) => {
    try {
        const companies = await Company.query().finder.deletedAt(false).withGraphFetched('address');
        res.json(companies);
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
        ['name','type', 'description', 'email'].forEach((prop) => {
            if(req.body[prop]){
                req.body[prop] = req.body[prop].toString().toLowerCase().trim();
            }
        });
        const newCompany = await Company.query().insert(req.body);
        res.json(newCompany);
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
        await Company.query().findById(id).delete();
        res.json("Company deleted.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;