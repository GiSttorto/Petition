const express = require("express");
const app = express();
const db = require("./db");
const auth = require("./auth.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
var bodyParser = require("body-parser");
// sudo service postgresql start --when the service is not running


// -------------------- DO NOT TOUCH ----------------------
// ___________________HANDLEBARS__________________
var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
// __________________HANDLEBARS__________________

// _______________USE_____________________
app.use(
  cookieSession({
    secret: `Ola!`,
    maxAge: 1000 * 60 * 60 * 24 * 15 * 10
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(csurf());
app.use(function(req, res, next) {
  res.setHeader("X-Frame-Options", "DENY");
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(function(req, res, next) {
    if (!req.session.userId && req.url != '/' && req.url != '/login'  && req.url != '/registration') {
        res.redirect('/');
    } else {
        next();
    }
});
// _______________USE_____________________


//_____________________FUNCTION___________________________
function checkUrl(url) {
    if (url === '') {
        return '';
    } else if (url.startsWith ("http://" || "https://") ) {
        return url;
    } else {
        return `http://`+ url;
    }
};
//_____________________FUNCTION___________________________
// -------------------- DO NOT TOUCH ----------------------


// _________________________________________________________________________________________________


// -------- HOME -----------
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", (req, res) => {
  res.redirect("/registration");
});
// -------- HOME -----------


// _________________________________________________________________________________________________


// -------- REGISTER -----------
app.get("/registration", (req, res, next) => {
    if (!req.session.userId) {
       res.render("registration");
   } else {
       res.redirect("/thankyou")
   }
});

app.post("/registration", (req, res) => {
  auth.hashPassword(req.body.password).then(hash => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    db.createUser(first, last, email, hash)
      .then(results => {
        // console.log("first: ", first);
        // console.log("results: ", results);
        req.session.userId = results.rows[0].id;
        req.session.first = results.rows[0].first;
        // console.log("session id: ", req.session.userId)
        // console.log("session first: ", req.session.first)
        res.redirect("/moreabout");
      })
      .catch(err => {
        console.log("error: ", err);
        res.render("registration", {
          err: err
        });
      });
  });
});
// -------- REGISTER -----------


// _________________________________________________________________________________________________


// -------- LOGIN -----------
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  db.getPassword(email).then(results => {
    // req.session.userId = results.rows[0].id;
    // console.log("session: ", req.session.userId);
    // console.log("email: ", email);
    // console.log("password: ", password);
    // console.log("results: ", results);
    // console.log("length: ", results.rows.length);
    if (results.rows.length === 0) {
        res.render("login", {
            email: "email"
        })
      // console.log("could not find email");
    } else {
      auth
        .checkPassword(req.body.password, results.rows[0].password)
        .then(data => {
          if (data === true) {
            res.render("thankyou");
          } else {
              res.render("login", {
                  password: "passoword"
              })
            console.log("password not ok");
            //need handlebars
          }
      }).catch (err => {
          console.log("Login error:  ", err);
      })
    }
  });
});
// -------- LOGIN -----------


// _________________________________________________________________________________________________


// -------- PROFILE(UPDATE) -----------
app.get("/moreabout", (req, res, next) => {
    if (!req.session.sigId) {
       res.render("moreabout", {
           layout: "main"
       })
   } else {
       res.redirect("thankyou");
   }
});

app.post("/moreabout", (req, res) => {
  let age = req.body.age;
  let city = req.body.city;
  let url = checkUrl(req.body.url);
  // console.log("age: ", age + " city: ", city + " url: ", url);
  return db
    .profile(age, city, url, req.session.userId)
    .then(() => {
      //results
      // console.log("results: ", results);
      res.redirect("/signature");
    })
    .catch(err => {
      // console.log("error: ", err);
      res.redirect("/moreabout");
    });
});


//___________ UPDATE _________________
app.get("/editprofile", (req, res) => {
  const user = req.session.userId;
  db.info(user)
    .then(results => {
      // console.log("results: ", results);
      res.render("edit", {
        result: results.rows[0]
      });
    })
    .catch((err) => {
      // console.log("error: ", err);
    });
});

app.post("/editprofile", (req, res) => {
    const userId = req.session.userId;
    let first = req.body.first;
    // console.log("first: ", first);
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.homepage;

    if (password) {
        auth.hashPassword(password)
            .then((hash) => {
                db.updateWithPass(first, last, email, hash, userId),
                db.update(age, city, url, userId)
            .then ((results) => {
                // req.session.userId = results.rows[0].id;
                req.session.first = results.rows[0].first;
                // console.log("results: ", results);
                res.redirect("/thankyou");
            })
            .catch((err) => {
                console.log("error: ", err);
            })
        })
    } else {
        db.updateNoPass(first, last, email, userId),
        db.update(age, city, url, userId)
        .then((results) => {
            // req.session.userId = results.rows[0].id;
            // req.session.first = results.rows[0].first;
            res.redirect("/thankyou");
        })
        .catch((err) => {
            console.log("error: ", err);
        })
    }

});
// -------- PROFILE(UPDATE) -----------


// _________________________________________________________________________________________________


// -------- SIGNATURE(CANVAS) -----------
app.get("/signature",  (req, res) => {
    if (!req.session.sigId) {
       res.render("signature", {
           layout: "main"
       });
   } else {
       res.redirect("/thankyou");
   }
});

app.post("/signature", (req, res) => {
  let sign = req.body.signature;
  // console.log("sign: ", sign);
  // console.log("user: ", req.session.userId);
  db.signatures(sign, req.session.userId)
    .then(results => {
      req.session.sigId = results.rows[0].id;
      // console.log("session: ", req.session.sigId);
      res.redirect("/thankyou");
    })
    .catch(err => {
      // console.log("error: ", err);
      res.render("signature", {
        layout: "main",
        err: "err"
      });
    });
});


//__________________ DELETE ____________________________
app.post("/signature/delete", (req, res) => {
    let userId = req.session.userId;
    db.delete(userId)
        .then(() => {
            // console.log("session: ", req.session);
            req.session.sigId = null;
            res.redirect("/signature");
        })
        .catch(err => {
            console.log("error: ", err);
            res.redirect("/thankyou");
        });
});
// -------- SIGNATURE(CANVAS) -----------


// _________________________________________________________________________________________________


// -------- THANK YOU -----------
app.get("/thankyou", (req, res) => {
  db.getsign(req.session.userId)
    .then(result => {;
        console.log("result: ", result);
      res.render("thankyou", {
        layout: "main",
        first: req.session.first,
        signature: result.rows[0].signature
      });
      // console.log("first", first);
    })
    .catch(err => {
      // console.log("erros: ", err);
    });
});

app.post("/thankyou", (req, res) => {
  res.redirect("/list");
});
// -------- THANK YOU -----------


// _________________________________________________________________________________________________


// -------- LIST -----------
app.get("/list", (req, res) => {
  db.list()
    .then(results => {
      // console.log("results: ", results);
      res.render("list", {
        layout: "main",
        people: results.rows
      });
    })
    .catch(err => {
      // console.log("error: ", err);
    });
});

app.get("/list/:city", (req, res) => {
  db.cities(req.params.city).then(result => {
    res.render("cities", {
      layout: "main",
      citylist: result.rows,
      city: req.params.city
    });
  });
});
// ---------------- LIST -----------------


//--------------- LOGOUT -----------------
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
//--------------- LOGOUT -----------------


app.listen(process.env.PORT || 8080, () => console.log("Server is running :)"));
