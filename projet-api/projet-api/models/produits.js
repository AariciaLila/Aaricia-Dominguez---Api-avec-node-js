/*============================================================================================*/
/*                             produits.js : Schéma de données d'un produit                   */
/*============================================================================================*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // méthode qui permet de créer un schéma de données pour notre base de données MongoDB

// Création d'un schéma produitsSchema pour tout article mis en ligne dans l'application

const produitsSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Object,
      required: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Produits', produitsSchema); // méthode qui transforme le modèle en modèle utilisable
