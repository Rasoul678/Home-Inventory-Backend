const express = require('express');
const User = require('./users.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.query()
    .select('id', 'name', 'email', 'created_at', 'updated_at')
    .whereNull('deleted_at');
    res.json(users);
});

module.exports = router;