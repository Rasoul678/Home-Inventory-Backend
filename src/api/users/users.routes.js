const express = require('express');
const User = require('./users.model');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get('/', middlewares.authenticateJWT, async (req, res) => {
    const users = await User.query().finder.deletedAt(false);

    res.json(users);
});

module.exports = router;