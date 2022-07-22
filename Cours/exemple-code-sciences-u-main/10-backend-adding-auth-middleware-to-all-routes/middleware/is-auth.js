/*============================================================================================*/
/*                   is-auth.js : Configuration du middleware d'authentification              */
/*============================================================================================*/

// Création du middleware qui va vérifier que l'utilisateur est bien connecté et transmettre les informations de connexions aux différentes méthodes qui vont gérer les requêtes.

// Implémentation du middleware d'authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization'); // extraction du token du header Authorization de la requête entrante
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1]; // utilisation de la fonction split pour tout récupérer après l'espace dans le header
  let decodedToken;
  // insertion d'un bloc try/catch pour les nouveaux problèmes qui peuvent se produire
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret'); // décodage de notre token
  } catch (err) { // affichage des erreurs générées
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId; // extraction de l'id de l'utilisateur de notre token et rajout à l'objet Request afin que nos différentes routes puissent l'exploiter
  next(); // dans le cas contraire tout fonctionne et l'utilisateur est authentifié
};
