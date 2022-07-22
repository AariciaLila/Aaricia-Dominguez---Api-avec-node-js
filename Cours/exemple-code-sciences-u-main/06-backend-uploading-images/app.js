/*============================================================================================*/
/*                     app.js : Ajout d'accepter les fichiers entrants avec multer            */
/*============================================================================================*/

// Implémentation des téléchargements de fichiers pour que les utilisateurs puissent télécharger des images d'articles à vendre
// => utilisation de multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Configuration du middleware de gestion des fichiers

const multer = require('multer');

const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({ // création d'une constante fileStorage à passer à multer comme configuration qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req, file, cb) => { // indique à multer d'enregistret les fichiers dans le dossier images
    cb(null, 'images'); // les images sont enregistrées dans un sous-dossier appelé images qu'il faudra créer dans le dossier racine
  },
  filename: (req, file, cb) => { // indique à multer d'utiliser le nom d'origine et de rajouter devant la date du jour séparé d'un "-" comme nom de fichier
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => { // utilisation de la constante dictionnaire mimetype pour résoudre l'extension de fichier approprié
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image') // exportation de l'élément multer entièrement configuré en lui passant la constante storage et en lui indiquant qu'on génèrera uniquement les téméchargements de fichiers image
);
app.use('/images', express.static(path.join(__dirname, 'images')));

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
