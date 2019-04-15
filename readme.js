// var bcrypt = require('bcryptjs');
//
// const{promisify} = require('util');
//
// const genSalt = promisify(bcrypt.genSalt);
// const hash = promisify(bcrypt.hash);
// const compare = promisify(bcrypt.compare);

// genSalt().then(
//     salt => {
//         console.log(salt);
//         return hash('foxydude99', salt);
//     }
// ).then(
//     hash => {
//         console.log(hash);
//         return compare('foxydude99', hash);
//     }
// ).then(
//     passwordDoesMatch = console.log(passwordDoesMatch);
// )

module.exports.compare = compare;
module.exports.hash = password => {
    genSalt(password).then(salt => {
        return hash (password, salt);
    });
};



CREATE TABLE users (
    first VARCHAR(100) NOT NULL CHECK first <> '',
    last VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
);

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL CHECK first <> '',
    last VARCHAR(100) NOT NULL,
    signature text NOT NULL,
    user_id NOT NULL REFERENCES users(id)
);


INSERT INTO users (first, last)
VALUES ($1, $2)
RETURNING id


<!-- url = starts with http// para prevenir algum erro malicoso

{{ #if url }}
<a hred="{{url}}" target="black">{{ first }} {{ last }}<a>
{{else}}
    {{first}} {{last}}
{{if}}
{{age}}
{{#city}}
<a href="/signers/{{city}}">{{city}}</a>
{{ city}} -->
