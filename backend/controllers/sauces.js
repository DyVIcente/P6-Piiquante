
const Sauce = require('../models/Sauce');
const fs = require('fs');



// LOGIQUE DES ROUTES SAUCES

// Créé la sauce****************************************
exports.createSauce = (req, res, next) => {
    // parser l'objet req , car il envoyé en json mais en chaine de caractere
    const sauceObject = JSON.parse(req.body.sauce);
    //on suppr l'id (car généré auto par la bdd, et userid qui correspond a la personne qui a créé l'objet du coup on utilise l'userid du token)
    delete sauceObject._id;
    //delete sauceObject._userId;
    //
    const sauce = new Sauce({
        ...sauceObject,
     //   userId: req.auth.userId,
        //       le protocol              le nom d'hote   images  le nom de fichier tel donné par multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => { res.status(201).json({message: 'objet enregistré '})})
    .catch(error => { res.status(500).json( { error })})
};

// Modif la sauce*************************************
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), // transforme un objet string en objet javascript
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // contruction de l'url comptète du fichier
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne( {_id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Access not granted'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(204).json({message : 'Objet modifié!'}))
                .catch(error => res.status(500).json({ error }));
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
 };

//Suppr la sauce*************************************************
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(204).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(500).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

//Get une seule sauce****************************************************
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Récupérer tous les objets*******************************************
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({ error }));
};




//Création like ou dislike (Post/:id/like)
exports.likeOrDislike = (req, res, next) => {
    // Si l'utilisateur aime la sauce
    if (req.body.like === 1) { 
      // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
        .then((sauce) => res.status(204).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(500).json({ error }));
    } else if (req.body.like === -1) { 
      // Si l'utilisateur n'aime pas la sauce
      // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
        .then((sauce) => res.status(204).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(500).json({ error }));
    } else { 
      // Si like === 0 l'utilisateur supprime son vote
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          // Si le tableau "userLiked" contient l'ID de l'utilisateur
          if (sauce.usersLiked.includes(req.body.userId)) { 
            // On enlève un like du tableau "userLiked" 
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                .then((sauce) => { res.status(204).json({ message: 'Like supprimé !' }) })
                .catch(error => res.status(500).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
              // Si le tableau "userDisliked" contient l'ID de l'utilisateur
            // On enlève un dislike du tableau "userDisliked" 
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                .then((sauce) => { res.status(204).json({ message: 'Dislike supprimé !' }) })
                .catch(error => res.status(500).json({ error }))
          }
        })
        .catch(error => res.status(500).json({ error }));
    }
  };