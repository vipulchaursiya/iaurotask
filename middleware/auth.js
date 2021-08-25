const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    //get the token from the header if present
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    let PUBLIC_KEY = 'Bearer'
    token.startsWith(PUBLIC_KEY) ? token = token.slice(PUBLIC_KEY.length + 1, token.length) : token = token;
    
    try {
        const decoded = jwt.verify(token, 'SomePrivateKeyHere');
        req.user = decoded;
        console.log("ikaj c",decoded)
        next();
    } catch (ex) {
        //if invalid token
        console.log("Invalid Token");
        res.status(400).send("Invalid token.");
    }
};