/*============================================================================================*/
/*                             app.js : Point d'entrée de l'application                       */
/*============================================================================================*/

const path =require('path');

// 1) Installation d'Express

const express = require('express');
const bodyParser = require('body-parser');

// 2) Configuration de la base de données
// => package qui facilite les interactions entre notre application Express et notre base de données MongoDB

const mongoose = require('mongoose');

// 3) Configuration du middleware de gestion des fichiers

const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const Produits = require('./models/produits');

// pour créer une application Express, on appelle simplement la méthode express()
const app = express();

require('dotenv').config({ debug: true, override: false })

// 2) Ajout des middlewares
// => bloc de code qui traite les requêtes et réponses de notre application
// => app.use() : permet d'attribuer un middleware à une route spécifique de l'application

app.use(bodyParser.json());

// 3) Ajout de la fonction permettant d'éviter les erreurs de CORS (Cross Origin Resource Sharing)
// => définit comment les serveurs et les navigateurs intéragissent, en spécifiant qu'elles ressources peuvent être demandées de manière légitime
// => pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), on précise des headers spécifiques de contrôle d'accès pour tous les objets de réponse

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // d'accéder à l'API depuis n'importe quelle origine avec '*'
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // d'envoyer des requêtes avec les méthodes mentionnées (GET, POST, PUT, pATCH, DELETE)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // d'ajouter les headers mentionnées aux requêtes envoyées vers l'API (Content-Type, Authorization)
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });

// 6) Connexion de l'API au cluster MongoDB
// => MongoDB Atlas permet d'héberger gratuitement une base de données MongoDB
mongoose.connect('mongodb+srv://root:root@cluster0.gslftzi.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => {
    console.log('Connexion à MongoDB réussie !')
    app.listen(8080);
})
.catch(() => console.log('Connexion à MongoDB échouée !'));