const express = require('express');
const router = express.Router();

//Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');

//Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

//Add submit POST route
router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});

//Update Submit
router.post('/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = { _id: req.params.id };
  Article.updateOne(query, article, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated!');
      res.redirect('/');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = { _id: req.params.id };

  Article.findById(req.params.id, function(err, article) {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err) {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//Get Single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render('article', {
        article,
        author: user.name
      });
    });
  });
});

//Access Controle
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
