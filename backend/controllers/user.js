// bcrypt installer aussi car nécessaire 
const bcrypt = require('bcrypt');

//implémentation de webtoken pour crypter notre token
const jwt = require('jsonwebtoken');

// besoin du model User car on va enregistrer et lire des Users
const User = require('../models/User');


//controllers a besoin de deux midleware

//haché le mdp, puis avec le hash créé par bcrypt on va enregistrer le user dans la bdd
// Fct signup qui va crypter le mdp, qui va prendre le mdp crypté un créé un nouveau user et l'adresse mail passée dans le corp de la requete et va enregistrer cet utilistauer dans la bdd
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // saler la fct 10x, plus c'est élevé plus cest long et sécurisé / c'est une fct asynch
        .then(hash => {
            const user = new User({      // on crée le user dans le then
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé' }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



// login, verif si un utilisateur qui se co dispose d'indentifiants valides
exports.login = (req, res, next) => {
    // on utilise findOne 
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire identifiant/mdp incorrecte' }); // utilisteur non trouvé, msg flou pour ne pas qu'il le sache si quelqu'un est deja enregistré
            } else {
                bcrypt.compare(req.body.password, user.password) // method compare de bcrypt, elle compare le mdp entré par l'utilisateur avec le hash enregistré dans la bdd
                    .then(valid => {
                        if (!valid) {                              // si ça ne correspond pas error 401 meme msg d'erreur qu'avant
                            res.status(401).json({ message: 'Paire identifiant/mdp incorrecte' });
                        } else {
                            res.status(200).json({         // si ok, on renvoit une rep 200 avec l'id utilisateur et un token
                                userId: user._id,
                                token: jwt.sign(            // fct sign de jwt pour chiffrer un nouveau token
                                    { userId: user._id },  // création d'un token / le userId est la en payload(données encodées) pour ne pas que d'autres utilisateurs peuvent changer les sauces
                                    'RANDOM_TOKEN_SECRET', // chaine qui sert de clé au cryptage 
                                    { expiresIn: '24h' }    // durée valide du token de 24h
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }                                                               // les catch erreur serveur
        })
        .catch(error => res.status(500).json({ error }));
};