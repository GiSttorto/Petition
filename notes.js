module.exports.app = app; (in app.js file);
const app = module.exports.app = express();
const profileRouter = require('profileRouters')


// ---- app.use

// ---- app.use

require("./auth");


//___________________________________________________________

function requireLoggedOutUser(req, res, next) {
        if (req.session.userId) {
            res.redirect('signature');
        } else {
            next();
        }
}


//___________________________________________________________

const app = require("./app.js")
const requireLoggedOutUser = require("./middleware") // file to functions

app.use(function(req, res, next) {
    if (!req.session.userId && req.url != '/register' && req.url != '/login') {
        res.redirect('/register');
    } else {
        next();
    }
});


app.get("/login", requireLoggedOutUser, (req, res) => {

});


app.get("/signature", requireUnSign, (req, res) => {

});

app.post("/signature", requireSignature, (req, res) => {

});


//___________________________________________________________

const express = require('express');
const router = ecpress.Router();

app.use("/profile", profi)

module.express.
