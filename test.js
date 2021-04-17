const Pool = require('./index') 

const pool = new Pool({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
})

const tester = async function() {
    const client =  await pool.connect()
    const res = await client.bucketExists('test')
    console.log(res)
}

tester()
tester()
tester()
tester()