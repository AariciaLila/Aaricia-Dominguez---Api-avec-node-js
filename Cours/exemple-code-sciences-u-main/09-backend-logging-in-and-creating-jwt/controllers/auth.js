/*============================================================================================*/
/*                            auth.js : Création des utilisateurs                             */
/*============================================================================================*/

// 1) Configuration des routes d'authentification
// => création de l'infrastructure nécessaure aux routes d'authentification

const { validationResult } = require('express-validator/check');
// bcrypt : package de chiffrement qui utilise un algorithme unidirectionnel pour chiffrer et créer un hash des mots de passe utilisateur en base de données
//        : créer un hash avec le mot de passe entré puis le compare au hash stocké dans la base de données
//        : permet d'indiquer si les deux hashs ont été générés à l'aide d'un même mot de passe initial
//        : aide à implémenter correctement le stockage et la vérification sécurisées des mots de passe
const bcrypt = require('bcryptjs');

// 4) Création des tokens d'authentification
// => permettent aux utilisateurs de se connecter une seule fois à leur compte
// => lorsqu'un utilisateur se connecte il reçoit son token

const jwt = require('jsonwebtoken'); // nouveau package qui permet de créer et vérifier les tokens d'authentification

const User = require('../models/user');

// 2) Création des utilisateurs

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt 
    .hash(password, 12) // appel de la fonction de hachage dans le mot de passe 12 fois pour que ce soit suffisamment sécurisé
    .then(hashedPw => { // fonction asynchrone qui renvoie une promesse dans laquelle on reçoit le hash généré
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(result => { // création de l'utilisateur et enregistrement dans la base de données en renvoyant une réponse de réussite en cas de succès et des erreurs avec le code d'erreur en cas d'échec
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// 3) Implémentation de la fonction login
// => méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email }) // utilisation du modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
    .then(user => {
      if (!user) { // dans le cas contraire, on renvoie une erreur 401 Unauthorized
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401; 
        throw error;
      } // si l'e-mail correspond à un utilisateur existant, on continue
      loadedUser = user;
      return bcrypt.compare(password, user.password); // méthode qui compare le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
    })
    .then(isEqual => { // s'ils correspondent, les informations d'identification de l'utilisateur sont valides
      if (!isEqual) { // s'il ne correspond pas, on renvoie une erreur 401 Unauthorized avec le même message que lorsque l'utilisateur n'a pas été trouvé afin de ne pas laisser quelqu'un vérifier si un autre personne est inscrite sur l'application
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign( // appel de la fonction pour chiffrer un nouveau token qui contient l'id de l'utilisateur en tant que playload (données encodées dans le token)
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret', // utilisation d'une chaîne secrète de développement tmporaire pour crypter notre token car sinon n'importe qui pourrait générer un token en se faisant passer pour notre application
        { expiresIn: '1h' } // définition de la durée de validité du token à 1, l'utilisateur devra donc se reconnecter au bout de 1 heure
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() }); // renvoie d'une réponse 200 contenant l'id de l'utilisateur et un token sous forme de chaîne générique
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
