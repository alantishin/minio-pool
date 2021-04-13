const EventEmitter = require('events').EventEmitter

class Pool extends EventEmitter {
    constructor(options) {
        super()

        this.options = Object.assign({}, options)
        this.options.max = this.options.max || this.options.poolSize || 10

        this._clients = []
    }

    get isFull() {
        return this._clients.length >= this.options.max
    }

    connect() {

    }
}

module.exports = Pool