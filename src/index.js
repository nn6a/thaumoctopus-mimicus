import Hapi from 'hapi'
import nunjucks from 'nunjucks'

nunjucks.configure('./dist')

// Create a server with a host and port
const server = new Hapi.Server()
server.connection({
    host: 'localhost',
    port: 8000
})

// Add the route
server.route({
    method: 'GET',
    // Path parameters
    path: '/hello/{fname}/{lname}',
    handler: function(request, reply) {
        nunjucks.render('index.html', {
            // Using path parameters
            fname: request.params.fname,
            lname: request.params.lname
        }, function(err, html) {
            reply(html)
        })
    }
})

// Start the server
server.start()
