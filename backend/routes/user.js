//besoin d'express pour créer un router
const express = require('express');
//Fct router d'express 
const router = express.Router();

const userCtrl = require('../controllers/user');

//On va créer de route POST
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// on export ce router ( comme ça on peut l'importer dans app.js)
module.exports = router;