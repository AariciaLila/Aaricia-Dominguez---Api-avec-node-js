/*============================================================================================*/
/*                     feed.js : Ajout de la possibilité de récupérer des données             */
/*============================================================================================*/

const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

// 1) Récupération de la liste de Posts en ligne
// => implémentation de la route GET afin qu'elle renvoie tous les Posts dans la base de données

router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  [
    body('title')
      .trim()
      .isLength({ min: 7 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

// 2) Récupération d'un Post spécifique
// => implémentation d'un appel GET différent pour trouver un Post individuel

router.get('/post/:postId', feedController.getPost); // méthode qui répond uniquement aux demandes GET à cet endpoint
                                                     // utilisation de : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre
module.exports = router;
