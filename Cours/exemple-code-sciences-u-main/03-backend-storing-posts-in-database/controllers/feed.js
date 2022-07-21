/*============================================================================================*/
/*                     feed.js : Ajout de la possibilité d'enregistrer les données            */
/*============================================================================================*/

const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Sciences-u'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Enregistrement des Posts dans la base de données
  // => création d'une instance du modèle Post en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Sciences-u' }
  });
  post
    .save() // méthode qui enregistre le Post dans la base de données
    .then(result => {
      res.status(201).json({ // renvoie d'une réponse de réussite avec un code 201
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => { // renvoie d'une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400
      console.log(err);
    });
};
