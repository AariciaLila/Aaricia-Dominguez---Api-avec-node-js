/*============================================================================================*/
/*                             auth.js : Création des utilisateurs                            */
/*============================================================================================*/

// 1) Configuration des routes d'authentification

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs'); // package de cryptage qu'on a installé avec npm

// 2) Création des tokens d'authentification

const jwtoken = require('jsonwebtoken'); // tokens chiffrés qui sont utilisés pour l'autorisation

const User = require('../models/user');

// 3) Création des utilisateurs

exports.signup = (req, res, next) => {
    console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12) // créer un hash crypté des mots de passe de nos utilisateurs pour les enregistrer de manière sécurisée dans la base de donnée
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'Utilisateur créé !', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// Implémentation de la fonction login
exports.login = (req, res, next) => {
  console.log('test', somesupersecretsecret)
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('Un utilisateur avec cette adresse e-mail n\'a pas pu être trouvé.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password); // compare un string avec un hash pour vérifier si le mot de passe entré par l'utilisateur correspond au hash sécurisé enregistré en base de données
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Mauvais mot de passe !');
        error.statusCode = 401;
        throw error;
      }
      const token = jwtoken.sign( // utilise une clé secrète pour chiffrer un token qui peut contenur un payload personnalisé et avoir une validité limitée
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        somesupersecretsecret,
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
