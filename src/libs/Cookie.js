const send = (refreshToken, res) => {
    const options = {
        maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }
    
    res.cookie('refreshToken', refreshToken, options);
}


module.exports = {
    send,
}