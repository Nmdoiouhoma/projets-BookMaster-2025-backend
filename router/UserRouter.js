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
router.get('/getAvis/:book_id',authenticateUser, bookController.getAvis);

router.get('/user/me', authenticateUser, (req, res) => {
    res.json(req.userDetails);

});

router.delete('/:id', authenticateUser, userController.deleteUser);
router.delete('/deleteBook/:space_id/:book_id',authenticateUser, userController.deleteBook);
router.patch('/updateUser/:id',upload.single("avatar"), authenticateUser, userController.updateUser);
router.patch('/updateBook/:user_id/:book_id', authenticateUser, userController.updateBook)

// Routes d'authentification
router.post("/signup", upload.single("avatar"), authController.createUser);
router.post('/login', authController.loginUser);

router.post('/addBook', authenticateUser, bookController.addBook)
router.post('/sendAvis', authenticateUser, bookController.sendAvis)
//@todo permettre de créer un avis

// Routes pour réinitialisation du mot de passe
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password/:token', passwordController.resetPassword);

// Route dynamique pour récupérer un utilisateur par ID (à placer à la fin)
router.get('/:id', userController.getOneUser);
router.get('/getListBook/:user_id', userController.getListBook);
router.get('/getBook/:book_id', userController.getOneBook);

module.exports = router;