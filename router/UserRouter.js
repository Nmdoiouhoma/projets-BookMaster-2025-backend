const express = require('express');
const UserController = require('../controller/UserController');
const authenticateUser = require('../middlewares/AuthMiddlewares');  // Middleware d'authentification
const authController = require('../controller/AuthController');
const passwordController = require('../controller/PasswordController');

const router = express.Router();
const userController = new UserController(); // Instanciation

// Routes publiques
// Routes publiques
router.get('/', userController.getHomePage);
router.get('/users', userController.getAllUsers);
router.get('/profile', authenticateUser, userController.getProfile);

// Routes d'authentification
router.post('/signup', authController.createUser);
router.post('/login', authController.loginUser);

// Routes pour réinitialisation du mot de passe
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);

// Route dynamique pour récupérer un utilisateur par ID (à placer à la fin)
router.get('/:id', userController.getOneUser);

// Routes protégées supplémentaires (elles utilisent également :id)
// Note : assure-toi qu'elles ne rentrent pas en conflit avec des routes statiques
router.delete('/:id', authenticateUser, userController.deleteUser);
router.patch('/:id', authenticateUser, userController.updateUser);

module.exports = router;