const express = require('express');
const UserController = require('../controller/UserController');
const authenticateUser = require('../middlewares/AuthMiddlewares');  // Middleware d'authentification
const authController = require('../controller/AuthController');
const passwordController = require('../controller/PasswordController');

const router = express.Router();
const userController = new UserController(); // Instanciation

// Routes publiques
router.get('/', userController.getHomePage);
router.get('/users', userController.getAllUsers);

// Route spécifique pour le profil, à placer avant la route dynamique
router.get('/profile', authenticateUser, userController.getProfile);

// Route dynamique pour récupérer un utilisateur par ID
router.get('/:id', userController.getOneUser);

// Routes protégées supplémentaires
router.delete('/:id', authenticateUser, userController.deleteUser);
router.patch('/:id', authenticateUser, userController.updateUser);

// Routes d'authentification
router.post('/signup', authController.createUser);
router.post('/login', authController.loginUser);

// Routes pour réinitialisation du mot de passe
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password/:token', passwordController.resetPassword);

module.exports = router;
