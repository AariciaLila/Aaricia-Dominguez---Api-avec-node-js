/*============================================================================================*/
/*                     post.js : Schéma de données d'un article                               */
/*============================================================================================*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Création d'un schéma postSchema pour tout article mis en ligne dans l'application
/** 
 * On créer un schéma de données qui contient les champs souhaités pour chaque postSchema.
 * On utilise la méthode Schema mise à disposition par Mongoose.
 */

const postSchema = new Schema(
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
// exportation du schéma en tant que modèle Mongoose appelé "postSchema" pour pouvoir le rendre disponible pour l'application Express
module.exports = mongoose.model('Post', postSchema);
