// Le model pour User

// importe de mongoose
const mongoose = require('mongoose'); 

// package validateur a rajouter en plugin
const uniqueValidator = require('mongoose-unique-validator');

// création du schema user 
const userSchema = mongoose.Schema({
 // unique pour impossible de se co avec la meme adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

//on l'applique au schema avant d'en faire un model, complète pour ne pas avoir d'erreur "unique"
userSchema.plugin(uniqueValidator);

// exporter le schema sous forme de model
module.exports = mongoose.model('User', userSchema);