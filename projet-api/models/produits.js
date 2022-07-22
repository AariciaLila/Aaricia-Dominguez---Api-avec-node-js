/**
 * post.js
 * 
 * Schéma de données d'un produit
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

module.exports = mongoose.model('Produits', produitsSchema);
