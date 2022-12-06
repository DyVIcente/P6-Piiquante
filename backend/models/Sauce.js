//on crée un schema de données avec toutes les infos, et one export le model

const mongoose = require('mongoose');
const User = require('./User');

//on utilise schema et on lui passe un objet 
const thingSchema = mongoose.Schema({

userId: { type: String, required: true },
name: { type: String, required: true},
manufacturer: { type: String, required: true},
description: { type: String, required: true},
mainPepper: { type: String, required: true},
imageUrl: { type: String, required: true},
heat: { type: Number, required: true },
likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },
usersLiked: { type: [String] },
usersDisliked: { type: [String] },


});

//on export le model avec un argument de nom du model et en deuxieme le schema
//la methode model transforme le schema en un model utilisable
module.exports = mongoose.model('Sauce', thingSchema);