//-----   DATABASE URL ON LOCAL MACHINE
var spicedPg = require('spiced-pg');


var db = spicedPg(process.env.DATABASE_URL || 'postgres:gonzalezgs:Naosabe1007@localhost:5432/petition');
// creatuser -sP someUsername


// ------  REGISTER
exports.createUser = function createUser (first, last, email, password) {
    let q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4)
            RETURNING id, first`;
    let params = [first, last, email, password];
    return db.query(q, params);
};

// ------- SIGNATURE
exports.signatures = function(signature, user_id){
    let q = `INSERT INTO signatures (signature, user_id)
            VALUES ($1, $2)
            RETURNING *`;
    let params = [signature, user_id];
    return db.query(q, params);
};


exports.getsign = function (user_id){
    let q = `SELECT signature FROM signatures WHERE user_id = $1`
    let params = [user_id];
    return db.query(q, params);
};


exports.delete = function (id){
    let q = `DELETE FROM signatures WHERE user_id = $1`
    let params = [id];
    return db.query(q, params);
};


// ------ LIST OF MEMBERS
exports.list = function () {
    let q = `SELECT first, last, age, city, url FROM signatures
            LEFT JOIN users
            ON users.id = signatures.user_id
            LEFT JOIN user_profiles
            ON user_profiles.user_id = signatures.user_id`;
    return db.query(q)
        .then(signer => {
            return signer;
        });
};

exports.cities = function (city) {
    let q = `SELECT first, last, age, url FROM signatures
    LEFT JOIN users
    ON users.id = signatures.user_id
    LEFT JOIN user_profiles
    ON user_profiles.user_id = signatures.user_id
    WHERE LOWER(city) = LOWER($1)`;
    let params = [city];
    return db.query(q, params);
};



// ------- LOGIN
exports.getPassword = function (email) {
    let q = `SELECT password, id FROM users WHERE email = $1`;
    let params = [email];
    return db.query(q, params);
};

// ------ PROFILE
exports.profile = function (age, city, url, user_id) {
    let q = `INSERT INTO user_profiles(age, city, url, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
    let params = [age, city, url, user_id];
    return db.query(q, params);
};


exports.info = function (id) {
    let q = `SELECT first, last, email, age, city, url FROM users
            LEFT JOIN user_profiles
            ON users.id = user_id
            WHERE user_id = $1`
    let params = [id]
    return db.query(q, params);
};

exports.update = function (age, city, url, user_id) {
    let q = `UPDATE user_profiles
            SET age = $1, city = $2, url = $3
            WHERE id = $4`
    let params = [age, city, url, user_id]
    return db.query(q, params);
};


exports.updateWithPass = function (first, last, email, password, id) {
    let q = `UPDATE users
            SET first = $1, last = $2, email = $3, password = $4
            WHERE id = $5 `
    let params = [first, last, email, password, id]
    return db.query(q, params);
};


exports.updateNoPass = function (first, last, email, id) {
    let q = `UPDATE users
            SET first = $1, last = $2, email = $3
            WHERE id = $4`
    let params = [first, last, email, id]
    return db.query(q, params);
};
