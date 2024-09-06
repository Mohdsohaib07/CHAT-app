const express = require('express');
const controller = require('../controllers/userController');
const {isloggedIn} = require('../middlewares/auth');
const router = express.Router();


router.get("/",controller.signup);
router.get("/login",controller.login);
router.get("/chat",isloggedIn,controller.chat);
// ⬇ to logout user and destroy session on server and browser
router.get('/logOut',controller.logout);
router.get('/forgot',controller.forgot);
router.post('/signup',controller.signUpData);
router.post('/login',controller.loginData);
router.post('/forgot',controller.forgotData);

module.exports.router=router;