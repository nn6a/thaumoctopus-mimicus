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

        let urlParts = url.split('?')
        let [path, search] = urlParts
        let match = this.router.route('get', path)
        let {route, params} = match
        let Controller = this.routes[route]

        if (route && Controller) {
            const controller = new Controller({
                query: query.parse(search),
                params: params,
                cookie: cookie
            })

            const request = () => {
            }
            const reply = replyFactory(this)

            if (push) {
                history.pushState({}, null, url)
            }

            controller.index(this, request, reply, (err) => {
                if (err) {
                    return reply(err)
                }

                // render controller response
                controller.render(this.options.target, (err, response) => {
                    if (err) {
                        return reply(err)
                    }

                    reply(response)
                })
            })
        }

        console.log(url)
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
    }
}
