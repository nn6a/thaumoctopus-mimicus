import Application from './lib'
import HelloController from './hello-controller'
import nunjacks from 'nunjucks'

nunjacks.configure('/templates')

const application = new Application({
    '/{name*}': HelloController
}, {
    target: 'body'
})

// Start the server
application.start()
