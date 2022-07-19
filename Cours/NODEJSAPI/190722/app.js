/*==============================================================================================*/
/*                              Démo 1 : Démarrer un serveur basique                            */
/*==============================================================================================*/

// 1) Importation du package HTTP qui sera exécutée à chaque appel du serveur
const { fstat } = require('fs');
const http = require('http');

// 2) Création du serveur
// http : fonction qui reçoit des objets request et response en tant qu'arguments
// => démarrage du serveur Node avec la méthode dreateServer du package http
const server = http.createServer((req, res) => {
    console.log(req);
    // const / let
    const { url, method } = req;
    // console.log(url, method);
    if (url === '/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write(`<body>
                        <form action="/message">
                            <input type="text" name="message">
                            <button type="submit">Send</button>
                        </form>
                </body>`)
        res.write('</html>');
        res.end();
    }
    if (url == '/message' && method === 'POST'){
        const body = [];
        // data event is emitted when data is received
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message);
            req.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        });

    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();

    

})

// 2) Configuration du serveur pour qu'il écoute
// 3000 : port par défaut qui nous servira dans le cas du cours
server.listen(3000);

// 3) Démarrage du serveur en exécutant node app.js
// => utilisation du lien http://localhost:3000 pour vérifier que la réponse soit correcte

