const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();


require('dotenv').config();


app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));//Helmet vous aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
// chanegement de policy car par default sameorigin


mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));





//headers d'acces à l'APi
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(mongoSanitize());
 // mongo sanitize enleve les demande avec $ et un . poru eviter les attaques pour ne pas avoir acces a la database
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
// on rajoute une route, qui va servir des fichiers static, on utilise le middleware static de express, on récupere le repertoire dans lequel sexecute le server et y concatener le rep images 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;




