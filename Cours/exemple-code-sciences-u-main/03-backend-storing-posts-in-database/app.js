/*============================================================================================*/
/*                     app.js : Ajout de la configuration à la base de données                */
/*============================================================================================*/

const express = require('express');
const bodyParser = require('body-parser');
/**
 * Mongoose est un package qui facilite les interactions avec la base de données MongoDB.
 * Il permet de valider le format des données, gérer les relations entre les documents, et communiquer directement avec la base de données pour la lecture et l'écriture des documents.
 * La base de données MongoDB est fractionnée en collections avec le nom de la collection au pluriel du nom du modèle : Posts.
 */
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

// Connexion de l'API au cluster MongoDB

mongoose
  .connect(
    'copiez-votre-mongo-connection-string-ici'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
