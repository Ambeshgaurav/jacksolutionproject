
const serviceMongoDb = require('../services/userDetailsServices');
const promise = require("bluebird");

function aunthetication(req, res, next) {
    promise.coroutine(function* () {
        let headers = req.headers.access_token
        let token_data = {
            access_token: headers
        }
        let get_data = yield serviceMongoDb.findToken(token_data) 
        if (get_data.length == 0) {
            console.log("session token expired");
            return res.send("session token expired")

        }
        else { 
            next();
        }
    })().catch((err) => {
        console.log(err);
        res.send(err);

    })

}


module.exports = {
    aunthetication: aunthetication

}