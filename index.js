'use strict'

const Minio = require('minio')
const EventEmitter = require('events').EventEmitter


class Pool extends EventEmitter {
    constructor(options) {
        super()

        this.options = Object.assign({}, options)
        this.options.max = this.options.max || this.options.poolSize || 10

        this._clients = []
        this._pendingQueue = []
    }

    get isFull() {
        return this._clients.length >= this.options.max
    }

    _createClient() {
        return new Minio.Client({
            endPoint: this.options.endPoint,
            port: this.options.port,
            useSSL: this.options.useSSL,
            accessKey: this.options.accessKey,
            secretKey: this.options.secretKey
          })
    }

    _pulseQueue () {
        const resolver = this._pendingQueue.shift()
        const client = this._clients[0]

        resolver(client)
    }

    connect() {
        if(this.isFull) {
            return false
        }

        const client = this._createClient()
        this._clients.push(client)


        const promise = new Promise((resolve, reject) => {
            this._pendingQueue.push(resolve)
        })

        this._pulseQueue()

        return promise
    }
}

module.exports = Pool