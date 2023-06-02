const crypto = require('crypto')

const key1 = crypto.randomBytes(32).toString('hex')
console.log(key1) 