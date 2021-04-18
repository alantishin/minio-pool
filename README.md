# minio-pool

Minio connections pool

## Usage example

    // Init pool
    const pool = new Pool({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'AKIAIOSFODNN7EXAMPLE',
        secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        poolSize: 5,
        pendingTimeout: 5000
    })

    // Get minio client 
    const client =  await pool.connect()

    // Execute minio function
    const res = await client.bucketExists('test')

    // Return client to available pool
    pool.release(client)
