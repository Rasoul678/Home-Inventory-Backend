const express = require('express');
const Country = require('./countries.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authenticateJWT, async (req, res, next) => {
  try {
    const countries = await Country.query().finder.deletedAt(false).withGraphFetched('states');
    res.json(countries);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', middlewares.authenticateJWT, async (req, res, next) => {
  const { id } = req.params;
  try {
    const country = await Country.query().findById(parseInt(id) || 0).withGraphFetched('states');
      if (country) {
        return res.json(country);
      }
      return next();
  } catch (error) {
      next(error);
  }
});

module.exports = router;
