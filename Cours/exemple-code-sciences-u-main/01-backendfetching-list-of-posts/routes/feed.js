/*============================================================================================*/
/*                             feed.js : Configuration du routage                             */
/*============================================================================================*/

const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// 1) Création de la route GET

router.get('/posts', feedController.getPosts);

// 2) Création de la route POST

router.post('/post', feedController.createPost);

module.exports = router;