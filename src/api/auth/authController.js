const bcrypt = require('bcrypt');
const validationSchema = require('./validationSchema');
const User = require('../users/users.model');
const jwt = require('../../libs/jwt');
const client = require('../../libs/init_redis');
const Cookie = require('../../libs/Cookie');


const errorMessages = {
    invalidLogin: 'Invalid email or passowrd.',
    emailInUse: 'Email in use.',
}

const signup = async (req, res, next) => {
    let { name, email, password, role } = req.body;
    try {
        const newUser = {name,email,password,role};
        
        await validationSchema.validate(newUser, {abortEarly: false});
        
        email = email.toLowerCase();

        const existingUser = await User.query().finder.email(email).first();

        if(existingUser){
            res.status(403);
            throw new Error(errorMessages.emailInUse)
        };

        const insertedUser = await User.query().insert({
            name,
            email,
            password,
            role
        });

        delete insertedUser.password;

        const payload = {
            id: insertedUser.id,
            name,
            email,
            role
        };

        const accessToken = await jwt.signAccessToken(payload);
        const refreshToken = await jwt.signRefreshToken(insertedUser.id);

        Cookie.send(refreshToken, res);

        res.json({
            user: payload,
            accessToken
        });

    } catch (error) {
        next(error)
    }
}


const signin = async (req, res, next) => {
    let { email, password } = req.body;
    try {
        await validationSchema.validate({
            name: 'username',
            email,
            password
        }, {
            abortEarly: false,
        });

        email = email.toLowerCase();

        const user = await User.query().finder.email(email).first();

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
            email,
            role: user.role
        };

        const accessToken = await jwt.signAccessToken(payload);
        const refreshToken = await jwt.signRefreshToken(user.id.toString());

        Cookie.send(refreshToken, res);

        res.json({
            user: payload,
            accessToken
        });

    } catch (error) {
        next(error)
    }
}


const refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;

        if(!refreshToken){
            const error = new Error('Bad Request');
            res.status(400);
            next(error);
        }

        const userId = await jwt.verifyRefreshToken(refreshToken);

        const user = await User.query().findById(userId).first();

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const accessToken = await jwt.signAccessToken(payload);
        const newRefreshToken = await jwt.signRefreshToken(userId.toString());

        Cookie.send(newRefreshToken, res);

        res.json({
            accessToken
        });

    } catch (error) {
        next(error);
    }
}

const signout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            const badRequestError = new Error('Bad Request');
            res.status(400);
            next(badRequestError);
        }

        const userId = await jwt.verifyRefreshToken(refreshToken);

        client.del(userId, (error, value) => {
            if(error){
                const internalServerError = new Error('Internal Server Error');
                next(internalServerError)
            }
            console.log(value);
            res.status(200);
            res.clearCookie('refreshToken');
            res.json({
                message: 'Logged out successfuly!'
            })
        });

    } catch (error) {
        next(error)
    }
}


module.exports = {
    signup,
    signin,
    refreshToken,
    signout,
}