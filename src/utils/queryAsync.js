const db = require('../models/database');

function queryAsync(sql, params){
    return new Promise((resolve, reject)=>{
        db.query(sql, params, (err, result)=>{
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = queryAsync;