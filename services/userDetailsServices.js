const connect = require('../config/configmongodb')




function SaveUserDetails(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('Customer2').find({
            email: data.email
        }).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else if (res.length == 0) {
                connect.dbo.collection('Customer2').insert(data, (err, res) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    else {
                        console.log("this ------->", res);
                        resolve(res.insertedCount);
                    }
                })
            }
            else {
                resolve(0)
            }
        });
    });
}
function saveToken(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('Customer2').updateOne({ email: data.email }, { $set: { access_token: data.access_token } }, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("=======================", res.modifiedCount);
                resolve(res.modifiedCount);

            }
        });
    });

}
function findData(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('Customer2').find({ email: data.email }).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res);
            }
        });
    })
}

function findToken(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('Customer2').find({ access_token: data.access_token }).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res);
            }
        });
    })

}
function saveUserProductList(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('productList').find({access_token:data.access_token}).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else if(res.length==0) { 
                connect.dbo.collection('productList').insert(data,(err, res) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(res);
                    }
                }); 
            }
            else 
            {
                var insert_data={}
                insert_data=data.data[0]
                connect.dbo.collection('productList').updateOne({access_token:data.access_token
                },{ $push: { data:insert_data} },(err, res) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(res.modifiedCount);
                    }
                }); 

            }
        });

    })
}
function findProductData(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('productList').find({ access_token: data.access_token }).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res);
            }
        });
    })

}
function updateProductData(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('productList').updateOne({access_token: data.access_token,
            data: {
                $elemMatch:
                    { product_id: data.product_id }
            }
        },
            { $set: { "data.$.category": data.category,"data.$.price": data.price} },(err, res) => {
            if (err) {
                reject(err)
            }
            else { 
                resolve(res.modifiedCount);
            }
        });
    })
}
function deleteProductData(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('productList').update({access_token: data.access_token,
        },{ $pull: { "data" : { product_id: data.product_id } } },
            (err, res) => {
            if (err) {
                reject(err)
            }
            else { 
                resolve(res);
            }
        });
    })
}
function findProductSpecificData(data) {
    return new Promise((resolve, reject) => {
        connect.dbo.collection('productList').find({access_token: data.access_token,
            data: {
                $elemMatch:
                    { product_id: data.product_id }
            }
        },
          ).toArray((err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res);
            }
        });
    })
}
module.exports = {
    SaveUserDetails: SaveUserDetails,
    saveToken: saveToken,
    findData: findData,
    findToken: findToken,
    saveUserProductList: saveUserProductList,
    findProductData:findProductData,
    updateProductData:updateProductData,
    deleteProductData:deleteProductData,
    findProductSpecificData:findProductSpecificData
}
