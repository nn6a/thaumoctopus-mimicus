import Application from './lib'
import HelloController from './hello-controller'
import HomeController from './home-controller'
import nunjucks from 'nunjucks'
import options from './options'

nunjucks.configure(options.nunjucks, {
    web: {async: true}
})

const application = new Application({
    '/hello/{name*}': HelloController,
    '/': HomeController
}, options)

application.start()
