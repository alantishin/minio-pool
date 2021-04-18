const Pool = require('./index') 

const pool = new Pool({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
})

const execute = async function(index) {
    const client =  await pool.connect()
    const res = await client.bucketExists('test')
    pool.release(client)

    console.log(index, res)
}

for(let i = 0; i < 100; i ++) {
    execute(i)
}