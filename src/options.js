import Hapi from 'hapi'
import nunjucks from 'nunjucks'

const server = new Hapi.Server({
    debug: {
        request: ['error']
    }
})

server.connection({
    host: 'localhost',
    port: 8000
})

const APP_FILE_PATH = '/application.js'

server.register(require('inert'), (err) => {
    if (err) {
        throw err
    }

    server.route([
        {
            method: 'GET',
            path: APP_FILE_PATH,
            handler: (request, reply) => {
                reply.file('dist/build/application.js')
            }
        },
        {
            method: 'GET',
            path: '/templates/{template*}',
            handler: (request, reply) => {
                reply.file('dist/' + request.params.template)
            }
        }
    ])
})

export default {
    nunjucks: './dist',
    server: server,
    document: function(application,
                       controller,
                       request,
                       reply,
                       body,
                       callback) {
        nunjucks.render('./index.html', {
            body: body,
            application: APP_FILE_PATH,
            state: controller.serialize()
        }, (err, html) => {
            if (err) {
                return callback(err, null)
            }
            callback(null, html)
        })
    }
}
