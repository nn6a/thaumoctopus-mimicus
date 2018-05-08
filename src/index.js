import Hapi from 'hapi'
import nunjucks from 'nunjucks'
import Application from './lib'
import HelloController from './hello-controller'

nunjucks.configure('./dist')

// Create a server with a host and port
const server = new Hapi.Server()
server.connection({
    host: 'localhost',
    port: 8000
})

const APP_FILE_PATH = '/application.js'

server.register(require('inert'), (err) => {
    if (err) {
        throw err
    }

    server.route({
        method: 'GET',
        path: APP_FILE_PATH,
        handler: (request, reply) => {
            reply.file('dist/build/application.js')
        }
    })
})

const application = new Application({
    '/hello/{name*}': HelloController
}, {
    server: server,
    document: function(application,
                       controller,
                       request,
                       reply,
                       body,
                       callback) {
        nunjucks.render('./index.html', {
            body: body,
            application: APP_FILE_PATH
        }, (err, html) => {
            if (err) {
                return callback(err, null)
            }
            callback(null, html)
        })
    }
})

// Start the server
application.start()
