const jwt = require('jsonwebtoken');
const client = require('./init_redis');


const signAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1d',
            issuer: 'HomeInventory.com',
            audience: payload.name
        };
        jwt.sign(payload, secret, options, (error, token) => {
            if(error) return reject(error);
            return resolve(token);
        });
    })
}

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '1y',
            issuer: 'HomeInventory.com',
            audience: userId
        };
        jwt.sign(payload, secret, options, (error, token) => {
            if(error) return reject(error);
            client.set(userId, token, 'EX', 31536000, (error, reply) => {
                if(error){
                    console.error(error.message);
                    const internalError = new Error('Internal Server Error');
                    return reject(internalError);
                }
                return resolve(token);
            });
        });
    })
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
            if (error) {
                return reject(error);
            }

            const userId = payload.aud;

            client.get(userId, (error, result) => {
                if(error){
                    console.log(error.message);
                    const internalError = new Error('Internal Server Error');
                    return reject(internalError)
                }

                if(refreshToken === result){
                    return resolve(userId)
                }else{
                    const unauthorizedError = new Error('Unauthorized');
                    return reject(unauthorizedError)
                }
            });
        });
    });
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
};