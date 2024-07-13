const jwt = require('jsonwebtoken');
const secret = 'BlogPostAPI';

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, secret, {});
}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);

        jwt.verify(token, secret, function (err, decodedToken) {
            if (err) {
                console.error('Error verifying token:', err.message);
                return res.send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                console.log("Decoded Token: ", decodedToken);
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.send({
            auth: false,
            message: 'Action Forbidden',
        });
    }
}
