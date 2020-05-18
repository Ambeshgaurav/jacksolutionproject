const jwt = require("jsonwebtoken")
const key = require('../controller/constant')

function generateToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data.id, key.secretKey.key, (err, token) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(token)
            }
        })

    })
}

function authenticateToken(data) {
    return new Promise((resolve, reject) => {
        // console.log(data.access_token,key.secretKey.key);
        jwt.verify(data.access_token, key.secretKey.key, (err, decode) => {
            if (err) {
                reject(err)
            }
            else {
                // console.log(decode);
                resolve(decode);
            }
        })
    })

}
module.exports= {
    generateToken: generateToken,
    authenticateToken: authenticateToken
}