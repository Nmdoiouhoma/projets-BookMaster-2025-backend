const express = require('express');
const UserController = require('../controller/UserController');
const authenticateUser = require('../middlewares/AuthMiddlewares');  // Importer le middleware d'authentification
const authController = require ('../controller/AuthController')
const router = express.Router();
const userController = new UserController(); // Instanciation

// Routes publiques
router.get('/', userController.getHomePage);
router.get('/users', userController.getAllUsers);
router.get('/:id', userController.getOneUser);

// Routes protégées (avec authentification)
router.get('/profile', authenticateUser, userController.getOneUser);  // Exemple de route protégée
router.post('/', authController.createUser);  // Créer un utilisateur (peut être public ou pas selon les besoins)
router.delete('/:id', authenticateUser, userController.deleteUser); // Suppression d'utilisateur (protégée)
router.patch('/:id', authenticateUser, userController.updateUser); // Mise à jour protégée

router.post('/signup', authController.createUser);
router.post('/login', authController.loginUser);

module.exports = router;
