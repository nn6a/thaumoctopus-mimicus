import Call from 'call'
import query from 'query-string'
import cookie from './cookie.client'
import replyFactory from './reply.client'

export default class Application {
    constructor(routes, options) {
        this.routes = routes
        this.options = options
        this.router = new Call.Router()
        this.registerRoutes(routes)
    }

    registerRoutes(routes) {
        for (let path in routes) {
            if (routes.hasOwnProperty(path)) {
                this.router.add({
                    path: path,
                    method: 'get'
                })
            }
        }
    }

    navigate(url, push = true) {
        if (!history.pushState) {
            window.location = url
            return
        }

        let previousController = this.controller
        this.controller = this.createController(url)

        if (this.controller) {
            const request = () => {
            }
            const reply = replyFactory(this)

            if (push) {
                history.pushState({}, null, url)
            }

            this.controller.index(this, request, reply, (err) => {
                if (err) {
                    return reply(err)
                }

                let targetEl = document.querySelector(this.options.target)
                if (previousController) {
                    previousController.detach(targetEl)
                }

                // render controller response
                this.controller.render(this.options.target, (err, response) => {
                    if (err) {
                        return reply(err)
                    }

                    reply(response)
                    this.controller.attach(targetEl)
                })
            })
        }
    }

    start() {
        this.popStateListener = window.addEventListener('popstate', (e) => {
            let {pathname, search} = window.location
            let url = `${pathname}${search}`
            this.navigate(url, true)
        })

        this.clickListener = document.addEventListener('click', (e) => {
            let {target} = e
            let identifier = target.dataset.navigate
            let href = target.getAttribute('href')

            if (identifier !== undefined) {
                if (href) {
                    e.preventDefault()
                }

                this.navigate(identifier || href)
            }
        })

        this.rehydrate()
    }

    createController(url) {
        // split the path and search string
        let urlParts = url.split('?')
        // destructure url parts array
        let [path, search] = urlParts
        // see if url path matches route in router
        let match = this.router.route('get', path)
        // destructure the route path and path path params
        let {route, params} = match
        // look up controller class in routes table
        let Controller = this.routes[route]

        return Controller ?
            new Controller({
                // parse search string into object
                query: query.parse(search),
                params: params,
                cookie: cookie
            }) : undefined
    }

    getUrl() {
        let {pathname, search} = window.location
        return `${pathname}${search}`
    }

    rehydrate() {
        let targetEl = document.querySelector(this.options.target)
        this.controller = this.createController(this.getUrl())
        this.controller.deserialize()
        this.controller.attach(targetEl)
    }
}
