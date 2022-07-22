/*============================================================================================*/
/*                             feed.js : Configuration des contrôleurs                        */
/*============================================================================================*/

const { validationResult } = require('express-validator/check');
const produits = require('../models/produits.js');
const Produits = require('../models/produits.js');
const fs = require('fs');
const path = require('path');

// 1) Récupération de la liste de produits en ligne

exports.getProduits = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Produits.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Produits.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(produits => {
      res
        .status(200)
        .json({
          message: 'Fetched produits successfully.',
          produits: produits,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// 2) Création d'un produit
// => modification des routes pour prendre en compte les fichiers

exports.createProduit = (req, res, next) => {
  console.log('req.file 1: ', req.file)
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imgUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  // 3) Enregistrement du produit dans la base de données
  const produits = new Produits({
    title: title,
    content: content,
    imageUrl: imgUrl,
    creator: { name: 'Sciences-u' }
  });
  produits
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Produit created successfully!',
        produits: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    );
   
};

// 4) Récupération d'un produit spécifique

exports.getProduit = (req, res, next) => {
  const produitId = req.params.produitId;
  Produits.findById(produitId)
    .then(produit => {
      if (!produit) {
        const error = new Error('Could not find produit.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Produitt fetched.', produit: produit });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getImg = (req, res, next) =>{
  console.log(req.file)
  res.send('ok')
};

// 5) Mise à jour d'un produit existant

exports.updatePost = (req, res, next) => {
  const produitId = req.params.produitId;
  console.log('req.file update: ', req.file.path);
  console.log('req.body update: ', req.body);

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Produits.findById(produitId)
    .then(produit => {
      if (!produit) {
        const error = new Error('Could not find produit.');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== produit.imageUrl) {
        clearImage(produit.imageUrl);
      }
      produit.title = title;
      produit.imageUrl = imageUrl;
      produit.content = content;
      return produit.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Produit updated!', produit: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
  
// 6) Suppression d'un produit

exports.deleteProduit = (req, res, next) => {
  const produitId = req.params.produitId;
  Produits.findById(produitId)
    .then(produit => {
      if (!produit) {
        const error = new Error('Could not find produit.');
        error.statusCode = 404;
        throw error;
      }
      clearImage(produit.imageUrl);
      return Produits.findByIdAndRemove(produitId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted produit.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};