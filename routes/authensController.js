var userModel = require('../models/userModel');
var express = require('express');
var router = express.Router();
var session = require('express-session');
router.use(session({
	resave: true, 
	saveUninitialized: true, 
	secret: 'somesecret', 
	cookie: { maxAge: 60*60*1000 }
}));
//check all url from my website
var checkSignIn = (req, res, next) => {
	if (req.url ==='/' || req.url==='/users/register' || req.url==='/users/login') {
		next();
	}else{
		req.session.user=JSON.parse(process.env.SESSION); //chu y session default: ktoan86@yahoo.com
		if (req.session.user) {
			next();
		}else{
			req.session.oldPath=req.url;
			res.redirect('/users/login');
		}
	}
}
router.use(checkSignIn); //Use my Mildware to check routers
module.exports = router;
