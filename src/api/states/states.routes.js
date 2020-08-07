const express = require('express');
const queries = require('./states.queries');

const router = express.Router();

router.get('/', async (req, res) => {
  const states = await queries.find();
  res.json(states);
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    // TODO: Validate the id. 
    const state = await queries.get(parseInt(id) || 0);
      if (state) {
        res.json(state);
      }
      next();
  } catch (error) {
      next(error);
  }
});

module.exports = router;
