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

const application = new Application({
    '/hello/{name*}': HelloController
}, {
    server: server
})

// Start the server
application.start()
