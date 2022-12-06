//importation de multer
const multer = require('multer');


const MIME_TYPES = {   // dictionnaire, est un objet et on les traduit
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//création d'un objet de config pour multer
const storage = multer.diskStorage({   // diskstorage dit qu'on l'enregistre sur le disque
    destination: (req, file, callback) => {  //ftc qui explique dans quel dossier enregistrer les fichiers
        callback(null, 'images');    // nulll pas derreur, et le nom du dossier en deuxieme arguement donc le dossier images
    },
    filename: (req, file, callback) => {   // explique a multer quel nom de fichier utiliser 
        const name = file.originalname.split(' ').join('_'); // généré le nouveau nom pour le fichier, on élimine les espace en tremplacant par des underscore
        const extension = MIME_TYPES[file.mimetype];   // du coup on crée lextension du fichier avec le mimetype
        callback(null, name + Date.now() + '.' + extension); // on appel le call back, nom créé + timestamp + . + extension du fichier
    }
}); // on a généré un nom de fichier assez unique pour notre app


// on exporte alors le middleware multer bien configuré ( fichier image uniquement)
module.exports = multer({ storage: storage }).single('image');