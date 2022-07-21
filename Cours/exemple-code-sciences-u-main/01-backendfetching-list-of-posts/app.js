/*============================================================================================*/
/*                             app.js : Point d'entrée de l'application                       */
/*============================================================================================*/

// 1) Installation d'Express

const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// 2) Ajout des middlewares (série de fonctions)

app.use(bodyParser.json());

// 3) Ajout de la fonction permettant d'éviter les erreurs de CORS (Cross Origin Resource Sharing)
/**
 * C'est un système de sécurité, qui, par défaut, bloque les appels HTTP entre des serveurs différents.
 * Cela empêche les requêtes malveillantes d'accéder à des ressources sensibles.
 * Pour cela, on doit ajouter des headers à notre objet response.
 */
app.use((req, res, next) => {
    // Ces headers permettent :
    res.setHeader('Access-Control-Allow-Origin', '*'); // d'accéder à l'API depuis n'importe quelle origine avec '*'
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // d'envoyer des requêtes avec les méthodes mentionnées (GET, POST, PUT, pATCH, DELETE)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // d'ajouter les headers mentionnées aux requêtes envoyées vers l'API (Content-Type, Authorization)
    next();
});

app.use('/feed', feedRoutes);

// 4) Exécution de l'application Express sur le serveur Node

app.listen(8080);