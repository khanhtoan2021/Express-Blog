var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var mongoose = require('mongoose');
var moment = require('moment');//format datetime vd: moment().format("YYYY-MM-DD HH:mm:ss");
const bcrypt = require('bcrypt');//password Encryption
const saltRounds = 10;
const {validationResult } = require('express-validator');


module.exports.getLogin = (req,res,next)=>{
	res.render('Users/loginForm');
}
module.exports.getLogout = (req,res,next)=>{
  req.session.destroy(function(er){
		res.redirect('/users/login');
	});
}
module.exports.getRegister = (req,res,next)=>{
	res.render('Users/registerForm');
}
module.exports.postLogin = (req,res,next)=>{
	const { body} = req;
	let errors = validationResult(req);
	let err=errors.array();
	//console.log(err);
	if (err.length>0) {
		res.render('Users/loginForm',{errors:err[0],kq:body})
	}else{
		userModel.find({email:body.email},['fullName','email','password','avatar']).then((val)=>{
			//console.log(val);
			bcrypt.compare(body.password, val[0].password, function(err, result) {
				if (result) {
					req.session.user=val;
					//console.log(req.session.user);
	      	if (req.session.oldPath) {
	      		res.redirect(req.session.oldPath);
	      	}else{
	      		res.redirect('/');
	      	}
	      }else{
	      	res.render('Users/loginForm',{errors:{msg:'Password is wrong!'},kq:body})
	      }
	    });
		})
	}
}
module.exports.postRegister = async (req,res,next)=>{
  const { body, file } = req;
	let errors = validationResult(req);
	let err=errors.array();
	//console.log(err);
	if (err.length>0) {
		res.render('Users/registerForm',{errors:err[0],kq:body})
	}else{// if no errors
	  delete body.passwordConfirm;
	  body.avatar=file.filename;
  	body.created=moment().format("YYYY-MM-DD HH:mm:ss");
	  await bcrypt.hash(body.password, saltRounds).then(function(hash) {
	      body.password=hash;
	  });
	  userModel.create(body).then((val)=>{
	    //let created = mongoose.Types.ObjectId(val._id).getTimestamp();
	    //let kq={id:val._id,avatar:val.avatar,created:created};
	    res.redirect('/users/login');
	  }).catch((err)=>{
	    res.send(err);
	  });
	}
}