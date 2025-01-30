class AuthMiddlewares {
    constructor() {}

    checkPassword = (req, res, next) => {
        const { authorization } = req.headers;
        if(!authorization) {
            return res.status(400).json('Erreur: mot de passe inccorrect ')
        }
        next();
    }
}

module.exports = AuthMiddlewares;