/*============================================================================================*/
/* app.js : Ajout configuration serveur pour renvoyer fichiers statiques pour route donnée    */
/*============================================================================================*/

const path = require('path'); // nouvelle importation pour accéder au path du serveur

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // ajout du gestionnaire de routage qui indique à Express qu'il faut gérer la ressource images dde manière statique (sous-répertoire du répertoire de base) à chaque fois qu'elle reçoit une requête vers la route /images

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    'copiez-votre-mongo-connection-string-ici'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
