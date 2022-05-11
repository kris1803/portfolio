var express = require('express');
var router = express.Router();
var request = require('sync-request');
let Movie = require('../models/movies');

// put your api key here
const mdbKey = ''
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// route pour affichage de la reponse api tmdb
router.get('/new-movies', (req, res, next) => {
  let response = request('GET', 'https://api.themoviedb.org/3/discover/movie?api_key='+mdbKey+'&language=fr-FR&region=CA&include_image_language=fr,null&sort_by=popularity.desc');
  response = JSON.parse((response.body));
  res.json(response);
})

router.post('/wishlist-movie', async (req, res, next) => {
  let movie = req.body;
  let newMovie = new Movie({
    movieName: movie.movieName,
    movieImg: movie.movieImg,
  });
  // save new movie to database
  let savedMovie = await newMovie.save();
  res.status(200).send(savedMovie)
});
router.delete('/wishlist-movie/:name', async (req, res, next) => {
  let movie = req.params.name;
  let deletedMovie = await Movie.deleteOne({movieName: movie});
  console.log(deletedMovie);
  let success = deletedMovie.acknowledged
  let deleted = deletedMovie.deletedCount
  res.status(200).send({success, deleted})
});
router.get('/wishlist-movie', async (req, res, next) => {
  let movies = await Movie.find();
  res.status(200).json(movies)
});

module.exports = router;
