const jwt = require('jsonwebtoken');

function notFound(req, res, next){
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const accessToken = authHeader.split(' ')[1];

        await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                if(error.name === 'TokenExpiredError'){
                    res.status(401);
                    next(error);
                }else{
                    const unauthorizedError = new Error('Token verification failed.');
                    res.status(403);
                    next(unauthorizedError);
                }
            }

            req.user = user;
            
            next();
        });
    } else {
        res.status(401);
        const error = new Error('You are not authorized');
        next(error);
    }
};

const errorTypes = {
    ValidationError: 422,
    UniqueViolationError: 409,
}

const errorMessages = {
    UniqueViolationError: 'Invalid: Already exists.'
}

function errorHandler(error, req, res, next){
    const statusCode = res.statusCode === 200 ? (errorTypes[error.name] || 500) : res.statusCode;
    res.status(statusCode);

    res.json({
        status: statusCode,
        message: errorMessages[error.name] || error.message,
        stack: process.env.NODE_ENV  === 'production' ? '🌵' : error.stack,
        errors: error.errors || undefined,
    });
}


module.exports = {
    notFound,
    errorHandler,
    authenticateJWT
};