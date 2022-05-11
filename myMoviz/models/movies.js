let mongoose = require('./bdd');

// création du schéma
let movieSchema = new mongoose.Schema({
    movieName: String,
    movieImg: String
});

// création du modèle
let Movie = mongoose.model('Movie', movieSchema);

// exportation du model
module.exports = Movie;
