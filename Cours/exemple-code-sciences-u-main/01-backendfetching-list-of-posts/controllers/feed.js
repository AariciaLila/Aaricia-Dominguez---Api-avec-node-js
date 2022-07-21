/*============================================================================================*/
/*                             feed.js : Configuration des contrôleurs                        */
/*============================================================================================*/

// 1) Fonction de publication des articles
/**
 * Dans cette fonction, on créé un groupe d'articles avec le schéma de données spécifiques requis.
 * On envoie ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
*/ 
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/yourimage.jpg',
        creator: {
          name: 'Sciences-u'
        },
        createdAt: new Date()
      }
    ]
  });
};

// 2) Fonction de création des articles

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
