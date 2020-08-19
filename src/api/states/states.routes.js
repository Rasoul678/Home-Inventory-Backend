const express = require('express');
const State = require('./states.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authenticateJWT, async (req, res, next) => {
  try {
    const states = await State.query()
      .finder.deletedAt(false)
      .withGraphFetched('[addresses, country]');
    res.json(states);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', middlewares.authenticateJWT, async (req, res, next) => {
  const { id } = req.params;
  try {
    const state = await State.query()
      .findById(parseInt(id) || 0)
      .withGraphFetched('addresses')
      .withGraphFetched('country');
      if (state) {
        return res.json(state);
      }
      return next();
  } catch (error) {
      next(error);
  }
});

module.exports = router;
