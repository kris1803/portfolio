var express = require('express');
var router = express.Router();
let UserModel = require('../models/user');
let bcrypt = require('bcrypt');
let uid2 = require('uid2');
let saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello World!');
});

router.post('/sign-up', async function (req, res, next) {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.json({ success: false, error: 'Please enter email and password.' });
  }
  let sameUser = await UserModel.findOne({ email: req.body.email });
  if (sameUser) {
    return res.json({ success: false, error: 'Email already exists.' });
  }
  const hash = bcrypt.hashSync(req.body.password, saltRounds);
  let user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    token: uid2(32)
  });
  await user.save((err, user) => {
    if (err) {
      return res.send({ success: false, error: err });
    } else {
      return res.send({ success: true, user: user });
    }
  });
});

router.post('/sign-in', async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.json({ success: false, error: 'Please enter email and password.' });
  }
  let user = await UserModel.findOne({
    email: req.body.email,
  });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password) ) {
      return res.json({ success: true, user: user });
    } else {
      return res.json({ success: false, error: 'Wrong password' });
    }
  } else {
    return res.json({ success: false, error: 'User not found' });
  }
});

router.post('/wishlist-article', async (req, res, next) => {
  if (!req.body.token || !req.body.article) {
    return res.json({ success: false, error: 'Please enter token and article.' });
  }
  let article = req.body.article;
  let user = await UserModel.findOne({
    token: req.body.token,
  });
  if (!user) {
    return res.json({ success: false, error: 'User not found' });
  }
  console.log(req.body)
  user.articles.push({
    urlToImage: article.urlToImage,
    title: article.title,
    description: article.description
  });

  await user.save((err, user) => {
    if (err) {
      return res.json({ success: false, user:user, error: err });
    } else {
      return res.json({ success: true, user: user, error:'' });
    }
  });
});

router.delete('/wishlist-article', async (req, res) => {
  // route must receive token and article
  if (!req.body.token || !req.body.article) {
    return res.json({ success: false, error: 'Please enter token and article.' });
  }
  let article = req.body.article;
  console.log(article)
  let user = await UserModel.findOne({
    token: req.body.token,
  });
  if (!user) {
    return res.json({ success: false, error: 'User not found' });
  }
  // frontend sends article without id, so we need to find it
  let index = user.articles.findIndex(x => x.title === article.title);
  if (index !== -1) {
    user.articles.splice(index, 1);
  } else {
    return res.json({ success: false, error: 'Article not found' });
  }
  await user.save();
  return res.json({ success: true, error:'' ,user: user });
})


module.exports = router;
