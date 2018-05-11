import Controller from './lib/controller'
import nunjucks from 'nunjucks'

export default class HomeController extends Controller {
    toString(callback) {
        nunjucks.render('home.html', {}, (err, html) => {
                if (err) {
                    return callback(err, null)
                }
                callback(null, html)
            }
        )
    }

    index(application, request, reply, callback) {
        if (!this.context.cookie.get('greeting')) {
            this.context.cookie.set('greeting', '1', {
                expires: 1000 * 60 * 60 * 24 * 365
            })
        } else {
            // Redirect to '/hello' at the second visit
            return reply.redirect('/hello')
        }

        callback(null)
    }
}
