'use strict'

const Minio = require('minio')

class PendingItem {
    constructor(params) {
        this.resolve = params.resolve
        this.reject = params.reject
        this.rejectTimeout = params.rejectTimeout
    }
}

class Pool {
    constructor(options) {
        this.options = Object.assign({}, options)
        this.options.poolSize = this.options.poolSize || 10
        this.options.pendingTimeout = this.options.pendingTimeout || 15000

        this._clients = []
        this.reservedClients = []
        this._pendingQueue = []
    }

    get isFull() {
        return this._clients.length >= this.options.poolSize
    }

    _createClient() {
        return new Minio.Client({
            endPoint: this.options.endPoint,
            port: this.options.port || 9000,
            useSSL: this.options.useSSL,
            accessKey: this.options.accessKey,
            secretKey: this.options.secretKey
          })
    }

    _pulseQueue () {
        const client = this._clients.find((el) => {
            return this.reservedClients.indexOf(el) === -1
        })

        if(!client) {
            return ;
        }
    
        const item = this._pendingQueue.shift()

        if(!item) {
            return ;
        }

        clearTimeout(item.rejectTimeout)
        item.resolve(client)
        this.reservedClients.push(client)
    }

    connect() {
        let client = null

        if(!this.isFull) {
            try {
                client = this._createClient()
                this._clients.push(client)
            } catch (error) {
                return Promise.reject(error)
            }
        }

        const response = new Promise((resolve, reject) => {
            this._pendingQueue.push(new PendingItem({
                resolve: resolve,
                reject: reject,
                rejectTimeout: setTimeout(() => {
                    this._pulseQueue()
                    reject(new Error('Pending timeout exceed'))
                }, this.options.pendingTimeout)
            }))
        })

        this._pulseQueue()

        return response
    }

    release(client) {
        const index = this.reservedClients.indexOf(client);

        if(index !== -1) {
            this.reservedClients.splice(index, 1)
        }

        this._pulseQueue()
    }
}

module.exports = Pool