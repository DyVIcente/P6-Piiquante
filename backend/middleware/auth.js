// verifier les info d'auth envoyées par le client 
//création d'un middleware qui prendra le token envoyé par le client en 
//verifiera la validité, et permettra aux routes dans exploiter les infos

//on importe jsonwebtoken
const jwt = require('jsonwebtoken');


const dotenv = require('dotenv');

dotenv.config();

//exporter le middleware
module.exports= (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(' ')[1];//récupérer le token, on le split, divise la chaine de caract dasn un tableau autour de l'esapce qui se trouve entre bearer et le token, et on recup le token qui est en en deuxieme
        const decodedToken = jwt.verify(token, process.env.CAMILLEBEST4EVER); // appel a la method verify de jwt, on lui passe le token et la clé, cela vérifie la validité dun token
        const userId = decodedToken.userId; //recuperation de l'userId et le decoder dans le token pour la recup
        req.auth = {
            userId: userId   // on rajoute a l'objet req qui lui est transmit au route appelées par la suite
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};
