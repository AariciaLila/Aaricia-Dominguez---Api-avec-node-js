/*============================================================================================*/
/*                     feed.js : Ajout de la possibilité de récupérer des données             */
/*============================================================================================*/

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

// 1) Récupération de la liste de Posts en ligne
// => implémentation de la route GET afin qu'elle renvoie tous les Posts dans la base de données

exports.getPosts = (req, res, next) => {
  Post.find() // méthode qui permet de renvoyer un tableau contenant tous les Posts dans la base de données
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Sciences-u' }
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// 2) Récupération d'un Post spécifique
// => implémentation d'un appel GET différent pour trouver un Post individuel

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId) // méthode qui permet de trouver le Post unique ayant le même _id que le paramètre de la requête
    .then(post => {
      if (!post) {
        // si aucun Post n'est trouvé ou si une erreur se produit, on envoie une erreur 404 à Postman, avec l'erreur générée
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
