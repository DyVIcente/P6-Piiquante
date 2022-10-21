const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const saucesCtrl = require('../controllers/sauces');


// Les routes disponibles dasn notre app
// Leurs noms nous donne ce qu'elles font
// La logique de chaques fonctions se retrouve dans controllers sauces.js



//Récupérer tous les objets
router.get('/', auth, saucesCtrl.getAllSauces);


//crée post la sauce
router.post('/', auth, multer, saucesCtrl.createSauce); // avec multer le format de la requete change

// Récupérer 1/une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

// modif
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// suppr
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//likedislike
router.post('/:id/like', auth, saucesCtrl.likeOrDislike); 




module.exports = router;