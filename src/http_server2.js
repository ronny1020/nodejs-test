const http = require('http');
const fs = require('fs');


const server = http.createServer((request, response) => {
    fs.writeFile(
        __dirname + '/../data/headers.json',
        JSON.stringify(request.headers),
        (error) => {
            if (error) {
                console.log(error);
                response.end('Errer');
            } else {
                response.end('ok');
            }
        }
    )


    //     response.writeHead(200, {
    //         'Content-Type': 'text/html'
    //     });
    //     response.end(`<div>Hello World!<br>${request.url}</div>`);
});
server.listen(3000);