export default class Controller {
    constructor(context) {
        this.context = context
    }

    index(application, request, reply, callback) {
        callback(null)
    }

    toString(callback) {
        callback(null, 'success')
    }

    render(target, callback) {
        this.toString(function(err, body) {
            if (err) {
                return callback(err, null)
            }

            document.querySelector(target).innerHTML = body
            callback(null, body)
        })
    }

    serialize() {
        return JSON.stringify(this.context.data || {})
    }

    deserialize() {
        // TODO: Fix JSON parse error
        // Uncaught SyntaxError: Unexpected token & in JSON at position 1
        // Replace escaped characters
        return this.context.data = JSON.parse(window.__STATE__)
    }

    attach(el) {
    }

    detach(el) {
    }
}
