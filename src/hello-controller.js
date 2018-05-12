import Controller from './lib/controller'
import nunjucks from 'nunjucks'

function getName(context) {
    // default values
    let name = {
        fname: 'Rick',
        lname: 'Sanchez'
    }
    // split path params
    let nameParts = context.params.name ? context.params.name.split('/') : []

    // order of precedence
    // 1. path param
    // 2. query param
    // 3. default value
    name.fname = (nameParts[0] || context.query.fname) || name.fname
    name.lname = (nameParts[1] || context.query.lname) || name.lname

    return name
}

function onClick(e) {
    console.log(e.currentTarget)
}

export default class HelloController extends Controller {
    toString(callback) {
        let context = getName(this.context)
        context.data = this.context.data

        nunjucks.render('hello.html', context, (err, html) => {
                if (err) {
                    return callback(err, null)
                }
                callback(null, html)
            }
        )
    }

    index(application, request, reply, callback) {
        this.context.cookie.set('random', '_' + (Math.floor(Math.random() * 1000) + 1), {path: '/'})
        this.context.data = {random: Math.floor(Math.random() * 1000) + 1}
        callback(null)
    }

    attach(el) {
        console.log(this.context.data.random)
        this.clickHandler = el.addEventListener('click', onClick, false)
    }

    detach(el) {
        el.removeEventListener('click', onClick, false)
    }
}

