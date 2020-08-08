const express = require('express');
const yup = require('yup');
const bcrypt = require('bcrypt');
const jwt = require('../../libs/jwt');
// TODO: Extract to general hashing util

const User = require('../users/users.model');

const router = express.Router();

const errorMessages = {
    invalidLogin: 'Invalid login.',
    emailInUse: 'Email in use.',

}

const schema = yup.object().shape({
    name: yup.string()
        .trim()
        .min(2)
        .required(),
    email: yup.string()
        .trim()
        .email()
        .required(),
    password: yup.string()
        .min(8)
        .max(100)
        .required()
        .matches(/[^A-Za-z0-9]/, 'password must contain a special character')
        .matches(/[A-Z]/, 'password must contain an uppercase letter')
        .matches(/[a-z]/, 'password must contain a lowercase letter')
        .matches(/[0-9]/, 'password must contain a number'),
});

router.post('/signup', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const newUser = {name, email, password};
        await schema.validate(newUser, {
            abortEarly: false,
        });

        const existingUser = await User.query().where({email}).first();

        if(existingUser){
            res.status(403);
            throw new Error(errorMessages.emailInUse)
        };

        // TODO: Get rounds from config.
        const hashedPassword = await bcrypt.hash(password, 12);

        const insertedUser = await User.query().insert({
            name,
            email,
            password: hashedPassword
        });

        delete insertedUser.password;

        const payload = {
            id: insertedUser.id,
            name,
            email
        };

        const token = await jwt.sign(payload);

        res.json({
            user: payload,
            token
        });

    } catch (error) {
        next(error)
    }
})


router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        await schema.validate({
            name: 'RaHeRo',
            email,
            password
        }, {
            abortEarly: false,
        });

        const user = await User.query().where({email}).first();

        if(!user){
            res.status(401);
            throw new Error(errorMessages.invalidLogin);
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            res.status(401);
            throw new Error(errorMessages.invalidLogin);
        }

        const payload = {
            id: user.id,
            name: user.name,
            email
        };

        const token = await jwt.sign(payload);

        res.json({
            user: payload,
            token
        });

    } catch (error) {
        next(error)
    }
})

module.exports = router;