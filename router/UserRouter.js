const express = require('express');
const UserController = require('../controller/UserController');
const authenticateUser = require('../middlewares/AuthMiddlewares');
const authController = require('../controller/AuthController');
const passwordController = require('../controller/PasswordController');
const bookController = require('../controller/BookController')
const upload = require("../middlewares/UploadMiddlewares");
const router = express.Router();
const userController = new UserController();

// Routes publiques
router.get('/', userController.getHomePage);
router.get('/users', userController.getAllUsers);
router.get('/profile', authenticateUser, userController.getProfile);
router.get('/reset-password/:token', passwordController.getResetPasswordPage);
router.get('/user/me', authenticateUser, (req, res) => {
    res.json(req.userDetails);
});

// Routes d'authentification
router.post("/signup", upload.single("avatar"), authController.createUser);
router.post('/login', authController.loginUser);

router.post('/addBook', authenticateUser, bookController.addBook)

// Routes pour réinitialisation du mot de passe
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password/:token', passwordController.resetPassword);


// Route dynamique pour récupérer un utilisateur par ID (à placer à la fin)
router.get('/:id', userController.getOneUser);
router.get('/getListBook/:user_id', userController.getListBook);

router.delete('/:id', authenticateUser, userController.deleteUser);
router.patch('/:id', authenticateUser, userController.updateUser);
router.delete('/deleteBook/:user_id/:book_id',authenticateUser, userController.deleteBook);
router.patch('/updateBook/:user_id/:book_id', authenticateUser, userController.updateBook)

module.exports = router;