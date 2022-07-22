/*============================================================================================*/
/*                             feed.js : Configuration du routage                             */
/*============================================================================================*/

 const express = require('express');
 const Produits = require('../models/produits');
 
 const feedController = require('../controllers/feed');
 
 const router = express.Router(); // méthode qui permet de créer des routeurs séparés pour chaque route principale de notre application pour qu'on puisse y enregistrer ensuite les routes individuelles
 const { body } = require('express-validator/check');
 const path = require('path');
 
 const multer = require('multer');
 
 const fileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'uploads/');
     },
     filename: (req, file, cb) => {
       cb(null, file.originalname);
     }
   });
   const fileFilter = (req, file, cb) => {
     console.log('file: ', file)
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
   const upload = multer({storage: fileStorage })
 
 
// 1) Création de la route GET
// => récupération de la liste de produits en ligne
// => router.get() : permet de réagir uniquement aux requêtes de type GET

 router.get('/produits',feedController.getProduits);

 // 2) Création de la route POST

 router.post(
     '/produit',
 [
     body('title')
       .trim()
       .isLength({ min: 5 }),
     body('content')
       .trim()
       .isLength({ min: 5 })
   ],  upload.single('file'),
   feedController.createProduit);

 // 3) Récupération d'un produit spécifique

 router.get('/produit/:produitId', feedController.getProduit);
 
// 4) Mise à jour d'un produit existant 

 router.put( // attribut un middleware à la requête de type PUT
     '/produit/edit/:produitId',
     [
       body('title')
         .trim()
         .isLength({ min: 5 }),
       body('content')
         .trim()
         .isLength({ min: 5 })
     ],upload.single('file'),
     feedController.updatePost
   );

 // 5) Ajout de la route DELETE

 router.delete('/produit/delete/:produitId', feedController.deleteProduit); // attribut un middleware à la requête de type DELETE
 
 module.exports = router;